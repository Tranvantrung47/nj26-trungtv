import axios from "axios";
import React from "react";
import { Button, Form, Input, Modal, Space, Table } from "antd";
// import { useForm } from "rc-field-form";

export default function CustomerPage() {
  const [refresh, setRefresh] = React.useState(0);
  const [customers, setCustomers] = React.useState([]);
  const [editModalVisible, setEditModalVisible] = React.useState(false);
  const [selectedCustomer, setSelectedCustomer] = React.useState(null);

  const columns = [
    {
      title: "STT",
      key: "no",
      width: "1%",
      render: (text, record, index) => {
        return (
          <div style={{ textAlign: "right" }}>
            <span>{index + 1}</span>
          </div>
        );
      },
    },
    {
      title: "Họ và tên",
      key: "FullName",
      render: (text, record, index) => {
        return (
          <div>
            <strong>
              {record.FirstName} {record.LastName}
            </strong>
          </div>
        );
      },
    },

    {
      title: "Email",
      dataIndex: "Email",
      key: "email",
    },

    {
      title: "",
      key: "actions",
      width: "1%",
      render: (text, record, index) => {
        return (
          <Space>
            <Button onClick={() => selectCustomer(record)}>Sửa</Button>
            <Button onClick={() => deleteCustomer(record.id)}>Xóa</Button>
          </Space>
        );
      },
    },
  ];

  React.useEffect(() => {
    axios.get("http://localhost:9000/customers").then((response) => {
      setCustomers(response.data);
    });
  }, [refresh]);

  const onFinish = (values) => {
    console.log(values);
    //   call API
    axios.post("http://localhost:9000/customers", values).then((response) => {
      if (response.status === 201) {
        creatForm.resetFields();
        setRefresh((f) => f + 1);
      }
      console.log(response.data);
    });
  };

  const onEditFinish = (values) => {
    console.log(values);
    // CODE HERE ...
    // CALL API TO CREATE CUSTOMER
    axios
      .patch("http://localhost:9000/customers/" + selectedCustomer.id, values)
      .then((response) => {
        if (response.status === 200) {
          updateForm.resetFields();
          setEditModalVisible(false);
          setRefresh((f) => f + 1);
        }
      });
  };

  const selectCustomer = (data) => {
    setEditModalVisible(true);
    setSelectedCustomer(data);
    updateForm.setFieldsValue(data);
    console.log(data);
  };

  const deleteCustomer = (id) => {
    console.log("click");
    axios.delete("http://localhost:9000/customers/" + id).then((response) => {
      if (response.status === 200) {
        setRefresh((f) => f + 1);
      }
    });
  };

  const [creatForm] = Form.useForm();
  const [updateForm] = Form.useForm();

  return (
    <div>
      {/* Form */}
      <Form
        form={creatForm}
        name="create-customer"
        onFinish={onFinish}
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
      >
        {/* firstName */}
        <Form.Item
          label="Họ"
          name="FirstName"
          rules={[
            {
              required: true,
              message: "Please input your FirstName!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        {/* LastName */}
        <Form.Item
          label="Tên"
          name="LastName"
          rules={[
            {
              required: true,
              message: "Please input your LastName!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        {/* Email */}
        <Form.Item
          label="Email"
          name="Email"
          rules={[
            {
              required: true,
              message: "Please input your Email!",
            },
            {
              type: "email",
              message: "Please input value Email!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        {/* button */}
        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
            Lưu thông tin
          </Button>
        </Form.Item>
      </Form>

      <Table
        rowKey="id"
        dataSource={customers}
        columns={columns}
        pagination={false}
      />

      {/* MODAL */}
      <Modal
        open={editModalVisible}
        centered
        title="Cập nhật thông tin"
        onCancel={() => {
          setEditModalVisible(false);
        }}
        cancelText="Đóng"
        okText="Lưu thông tin"
        onOk={() => {
          updateForm.submit();
        }}
      >
        <Form
          form={updateForm}
          name="update-customer"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          onFinish={onEditFinish}
        >
          {/* FIRST NAME */}
          <Form.Item
            label="Họ"
            name="FirstName"
            rules={[
              {
                required: true,
                message: "Please input your first name!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          {/* LAST NAME */}
          <Form.Item
            label="Tên"
            name="LastName"
            rules={[
              {
                required: true,
                message: "Please input your last name!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          {/* EMAIL */}
          <Form.Item
            label="Thư điện tử"
            name="Email"
            rules={[
              {
                required: true,
                message: "Please input your email!",
              },
              {
                type: "email",
                message: "Please input your valid email!",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
