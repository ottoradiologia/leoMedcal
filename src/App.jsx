import React, { useState } from 'react';
import { Layout, Input, Button, List, Upload, message } from 'antd';
import { SendOutlined, UploadOutlined } from '@ant-design/icons';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './App.css';

const { Header, Content, Footer } = Layout;

const App = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const genAI = new GoogleGenerativeAI(import.meta.env.GEMINI_API_KEY);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5' });
      const chat = model.startChat({ history: messages });

      const result = await chat.sendMessage(userMessage.text);
      const response = await result.response;
      const modelMessage = { role: 'model', text: response.text() };

      setMessages((prev) => [...prev, modelMessage]);
    } catch (error) {
      message.error('Erro ao se comunicar com a API.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = (file) => {
    message.info(`Arquivo ${file.name} enviado (simulado).`);
  };

  return (
    <Layout className="layout">
      <Header>
        <h1 style={{ color: 'white' }}>Chat - História Clínica</h1>
      </Header>
      <Content style={{ padding: '20px' }}>
        <List
          dataSource={messages}
          renderItem={(msg) => (
            <List.Item>
              <strong>{msg.role === 'user' ? 'Você:' : 'IA:'}</strong> {msg.text}
            </List.Item>
          )}
          style={{ marginBottom: '20px' }}
        />
        <Input.TextArea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={4}
          placeholder="Digite aqui sua mensagem..."
          disabled={loading}
        />
        <div style={{ display: 'flex', marginTop: '10px' }}>
          <Upload beforeUpload={handleUpload} maxCount={1}>
            <Button icon={<UploadOutlined />} disabled={loading}>
              Enviar Arquivo
            </Button>
          </Upload>
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSendMessage}
            style={{ marginLeft: '10px' }}
            loading={loading}
          >
            Enviar
          </Button>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>História Clínica ©2024</Footer>
    </Layout>
  );
};

export default App;
