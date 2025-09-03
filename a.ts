import { Hocuspocus } from '@hocuspocus/server';
import * as Y from 'yjs';

const server = new Hocuspocus({
  port: 1234,
  extensions: [
    {
      // 连接时触发
      onConnect({ documentName, request, socketId }) {
        console.log(`✅ 客户端连接: ${socketId} -> 文档: ${documentName}`);
        return Promise.resolve();
      },

      // 认证
      onAuthenticate({ token, documentName }) {
        console.log(`🔐 认证请求 - 文档: ${documentName}, Token: ${token}`);

        if (token !== 'super-secret-token') {
          throw new Error('认证失败：无效的 token');
        }

        // 返回用户信息
        return Promise.resolve({
          user: {
            id: Date.now(),
            name: `用户_${Math.floor(Math.random() * 1000)}`,
          },
        });
      },

      // 文档加载时
      onLoadDocument({ documentName, document }) {
        console.log(`📄 加载文档: ${documentName}`);

        // 初始化文档结构（如果需要）
        const yText = document.getText('shared-text');
        if (yText.toString() === '') {
          yText.insert(0, '欢迎使用协作编辑器！');
        }

        return Promise.resolve(document);
      },

      // 文档变化时
      onChange({ documentName, document, context }) {
        const yText = document.getText('shared-text');
        const content = yText.toString();

        console.log(`\n📝 文档更新 - ${documentName}`);
        console.log(`   用户: ${context.user?.name || '未知'}`);
        console.log(`   内容长度: ${content.length} 字符`);
        console.log(
          `   内容预览: ${content.substring(0, 100)}${content.length > 100 ? '...' : ''}`,
        );

        // 可以在这里添加更多逻辑，如：
        // - 保存到数据库
        // - 发送通知
        // - 记录审计日志

        return Promise.resolve();
      },

      // 定期存储文档
      onStoreDocument({ documentName, document }) {
        console.log(`💾 存储文档: ${documentName}`);

        const yText = document.getText('shared-text');
        const content = yText.toString();

        // 这里可以将文档保存到数据库或文件系统
        // 示例：保存到内存（实际应用中应该使用数据库）
        if (!global.documents) {
          global.documents = {};
        }
        global.documents[documentName] = {
          content,
          lastSaved: new Date().toISOString(),
          state: Y.encodeStateAsUpdate(document),
        };

        console.log(`   已保存 ${content.length} 字符`);
        return Promise.resolve();
      },

      // 断开连接时
      onDisconnect({ documentName, context, socketId }) {
        console.log(`❌ 客户端断开: ${socketId} - 用户: ${context.user?.name || '未知'}`);
        return Promise.resolve();
      },

      // 销毁文档时（所有客户端都断开连接）
      //   onDestroy({ documentName }) {
      //     console.log(`🗑️ 销毁文档: ${documentName}`);
      //   },
    },
  ],

  // 可选：配置选项
  quiet: false, // 显示日志
  timeout: 30000, // 超时时间
  debounce: 2000, // 防抖时间（存储文档）
});

// 启动服务器
server.listen().then(() => {
  console.log(`
  🚀 Hocuspocus 协作服务器已启动
  ================================
  HTTP: http://localhost:1234
  WebSocket: ws://localhost:1234
  ================================
  等待客户端连接...
  `);
});

// 优雅关闭
process.on('SIGINT', async () => {
  console.log('\n正在关闭服务器...');
  await server.destroy();
  process.exit(0);
});

// 声明全局类型（TypeScript）
declare global {
  var documents: Record<
    string,
    {
      content: string;
      lastSaved: string;
      state: Uint8Array;
    }
  >;
}
