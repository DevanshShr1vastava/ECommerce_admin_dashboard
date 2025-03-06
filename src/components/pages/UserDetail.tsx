import { MailOutlined, PhoneOutlined } from "@ant-design/icons";
import { useParams } from "react-router";
import { Row, Col, Card, Descriptions, Tag, Spin } from "antd";
import { userStore } from "../utils/AppStores";
import { useEffect, useState } from "react";

const UserDetail = () => {
  const { id } = useParams();
  const UserStore = userStore();
  const user = UserStore.users.find((user)=>user.id === Number(id));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(()=>{
    if (UserStore.users.length === 0) {
      UserStore.fetchUsers().then(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  },[])

  if (isLoading) {
    return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }} />;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div style={{ margin: "20px" }}>
      <Row gutter={16}>
        <Col span={12}>
          <Card title="Profile" loading={isLoading}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <img height={250} width={250} alt="User Image" src={user.image} />
              <div style={{ padding: 32 }}>
                <Descriptions column={1}>
                  <Descriptions.Item label="Name">
                    {user.firstName} {user.lastName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Username">{user.username}</Descriptions.Item>
                  <Descriptions.Item label="Gender">{user.gender}</Descriptions.Item>
                  <Descriptions.Item label="Age">{user.age}</Descriptions.Item>
                  <Descriptions.Item label="Birth Date">{user.birthDate}</Descriptions.Item>
                  <Descriptions.Item label="Blood Group">{user.bloodGroup}</Descriptions.Item>
                  <Descriptions.Item label="Height">{user.height} cm</Descriptions.Item>
                  <Descriptions.Item label="Weight">{user.weight} kg</Descriptions.Item>
                  <Descriptions.Item label="Eye Color">{user.eyeColor}</Descriptions.Item>
                </Descriptions>
              </div>
            </div>
          </Card>
          <br />
          <Row gutter={18}>
            <Col span={12}>
              <Card loading={isLoading} title="Bank Info">
                <Descriptions column={1}>
                  <Descriptions.Item label="Card Number">{user.bank.cardNumber}</Descriptions.Item>
                  <Descriptions.Item label="Card Type">{user.bank.cardType}</Descriptions.Item>
                  <Descriptions.Item label="Currency">{user.bank.currency}</Descriptions.Item>
                  <Descriptions.Item label="IBAN">{user.bank.iban}</Descriptions.Item>
                  <Descriptions.Item label="Card Expiry Date">{user.bank.cardExpire}</Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>
            <Col span={12}>
              <Card loading={isLoading} title="Crypto Info">
                <Descriptions column={1}>
                  <Descriptions.Item label="Coin">{user.crypto.coin}</Descriptions.Item>
                  <Descriptions.Item label="Wallet">{user.crypto.wallet}</Descriptions.Item>
                  <Descriptions.Item label="Network">{user.crypto.network}</Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>
          </Row>
        </Col>

        <Col span={12}>
          <Card loading={isLoading} title="Contact Information">
            <Descriptions column={1}>
              <Descriptions.Item label="Email">
                <a href={`mailto:${user.email}`}><MailOutlined /> {user.email}</a>
              </Descriptions.Item>
              <Descriptions.Item label="Phone">
                <a href={`tel:${user.phone}`}><PhoneOutlined /> {user.phone}</a>
              </Descriptions.Item>
              <Descriptions.Item label="IP Address">{user.ip}</Descriptions.Item>
              <Descriptions.Item label="MAC Address">{user.macAddress}</Descriptions.Item>
              <Descriptions.Item label="Role">
                <Tag color={user.role === "admin" ? "red" : user.role === "moderator" ? "orange" : "blue"}>{user.role}</Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>
          <br />
          <Card loading={isLoading} title="Address">
            <Descriptions column={1}>
              <Descriptions.Item label="Address">{user.address.address}</Descriptions.Item>
              <Descriptions.Item label="City">{user.address.city}</Descriptions.Item>
              <Descriptions.Item label="State">
                {user.address.state} ({user.address.stateCode})
              </Descriptions.Item>
              <Descriptions.Item label="Postal Code">{user.address.postalCode}</Descriptions.Item>
              <Descriptions.Item label="Country">{user.address.country}</Descriptions.Item>
            </Descriptions>
          </Card>
          <br />
          <Card loading={isLoading} title="Company">
            <Descriptions column={1}>
              <Descriptions.Item label="Company Name">{user.company.name}</Descriptions.Item>
              <Descriptions.Item label="Department">{user.company.department}</Descriptions.Item>
              <Descriptions.Item label="Title">{user.company.title}</Descriptions.Item>
              <Descriptions.Item label="Company Address">
                {user.company.address.address}, {user.company.address.city}, {user.company.address.state}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UserDetail;
