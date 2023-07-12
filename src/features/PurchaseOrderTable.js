import React, { useState, useEffect } from 'react';
import { Table, Form, Button } from 'antd';
import EditableCell from './EditableCell';

const PurchaseOrderTable = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  const [itemOptions, setItemOptions] = useState([]);

  useEffect(() => {
    fetchItemOptions();
  }, []);

  const fetchItemOptions = async () => {
    try {
      // Replace 'ITEM_LOOKUP_API_URL' with your actual item lookup API endpoint
      const response = await fetch('https://jsonplaceholder.typicode.com/posts');
      const jsonData = await response.json();
      const transformedData = jsonData.map((item) => ({
        value: item.id,
        label: item.title,
      }));
      
      setItemOptions(transformedData);
    } catch (error) {
      console.error('Error fetching item options:', error);
    }
  };

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({ item: '', quantity: '', price: '', ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const handleNew = () => {
    const newData = {
      key: Date.now(),
      item: '',
      quantity: '',
      price: '',
    };
    setData([...data, newData]);
    setEditingKey(newData.key);
  };

  const handleAutocompleteSelect = (value, dataIndex) => {
    const newData = [...data];
    const index = newData.findIndex((item) => item.key === editingKey);

    if (index > -1) {
      const selectedItem = itemOptions.find((item) => item.name === value);
      newData[index][dataIndex] = selectedItem ? selectedItem.value : '';
      setData(newData);
    }
  };

  const columns = [
    {
      title: 'Item',
      dataIndex: 'item',
      width: '25%',
      editable: true,
      inputType: 'autocomplete',
      options: itemOptions,
      onCell: (record) => ({
        record,
        dataIndex: 'item',
        title: 'Item',
        editing: isEditing(record),
        inputType: 'autocomplete',
        options: itemOptions,
        handleAutocompleteSelect: handleAutocompleteSelect,
      }),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      width: '15%',
      editable: true,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      width: '15%',
      editable: true,
    },
    {
      title: 'Operation',
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <a href="#" onClick={() => save(record.key)} style={{ marginRight: 8 }}>
              Save
            </a>
            <a href="#" onClick={cancel}>
              Cancel
            </a>
          </span>
        ) : (
          <a href="#" onClick={() => edit(record)}>
            Edit
          </a>
        );
      },
    },
  ];
  
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
  
    return {
      ...col,
      onCell: (record) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
        inputType: col.inputType,
        options: col.options,
        handleAutocompleteSelect: handleAutocompleteSelect,
      }),
    };
  });
  

  return (
    <Form form={form} component={false}>
      <div style={{ marginBottom: 16 }}>
        <Button onClick={handleNew} type="primary" style={{ marginBottom: 16 }}>
          New
        </Button>
      </div>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={false}
      />
    </Form>
  );
};

export default PurchaseOrderTable;
