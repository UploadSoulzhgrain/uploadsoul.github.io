import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Row, Col, Button, Modal, Select, Space, Typography } from 'antd';
import { GlobalOutlined, UserOutlined, TeamOutlined, HeartOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;
const { Option } = Select;

const DigitalWorldPage = () => {
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedScene, setSelectedScene] = useState(null);
  const [selectedMode, setSelectedMode] = useState('single');

  const scenes = [
    {
      id: 'home',
      title: t('digitalWorld.scenes.home.title'),
      description: t('digitalWorld.scenes.home.description'),
      icon: '🏠'
    },
    {
      id: 'park',
      title: t('digitalWorld.scenes.park.title'),
      description: t('digitalWorld.scenes.park.description'),
      icon: '🌳'
    },
    {
      id: 'beach',
      title: t('digitalWorld.scenes.beach.title'),
      description: t('digitalWorld.scenes.beach.description'),
      icon: '🏖️'
    },
    {
      id: 'custom',
      title: t('digitalWorld.scenes.custom.title'),
      description: t('digitalWorld.scenes.custom.description'),
      icon: '🎨'
    }
  ];

  const modes = [
    { value: 'single', label: t('digitalWorld.modes.single'), icon: <UserOutlined /> },
    { value: 'multi', label: t('digitalWorld.modes.multi'), icon: <TeamOutlined /> },
    { value: 'couple', label: t('digitalWorld.modes.couple'), icon: <HeartOutlined /> }
  ];

  const handleSceneSelect = (scene) => {
    setSelectedScene(scene);
    setIsModalVisible(true);
  };

  const handleModeSelect = (mode) => {
    setSelectedMode(mode);
  };

  const handleStartExperience = () => {
    // TODO: Implement the actual experience start logic
    console.log('Starting experience with:', { selectedScene, selectedMode });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-8">
      <div className="max-w-7xl mx-auto">
        <Title level={1} className="text-center mb-8">
          <GlobalOutlined className="mr-2" />
          {t('digitalWorld.title')}
        </Title>
        
        <Paragraph className="text-center text-lg mb-12">
          {t('digitalWorld.description')}
        </Paragraph>

        <Row gutter={[24, 24]}>
          {scenes.map((scene) => (
            <Col xs={24} sm={12} lg={6} key={scene.id}>
              <Card
                hoverable
                className="h-full"
                onClick={() => handleSceneSelect(scene)}
              >
                <div className="text-4xl mb-4">{scene.icon}</div>
                <Title level={4}>{scene.title}</Title>
                <Paragraph>{scene.description}</Paragraph>
              </Card>
            </Col>
          ))}
        </Row>

        <Modal
          title={t('digitalWorld.modal.title')}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <Space direction="vertical" size="large" className="w-full">
            <div>
              <Title level={5}>{t('digitalWorld.modal.selectMode')}</Title>
              <Select
                className="w-full"
                value={selectedMode}
                onChange={handleModeSelect}
              >
                {modes.map((mode) => (
                  <Option key={mode.value} value={mode.value}>
                    <Space>
                      {mode.icon}
                      {mode.label}
                    </Space>
                  </Option>
                ))}
              </Select>
            </div>

            <Button
              type="primary"
              size="large"
              block
              onClick={handleStartExperience}
            >
              {t('digitalWorld.modal.startExperience')}
            </Button>
          </Space>
        </Modal>
      </div>
    </div>
  );
};

export default DigitalWorldPage; 