import React from 'react';
import { AutoComplete, Form, Input } from 'antd';

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  handleAutocompleteSelect,
  options,
  ...restProps
}) => {
  const renderInput = () => {
    if (inputType === 'autocomplete') {
      return (
        <Form.Item name={dataIndex} style={{ margin: 0 }}>
          <AutoComplete
            options={options}
            getOptionLabel={(option) => option.name} // Specify the property for the display label
            renderOption={(option) => option.name} // Specify how each option should be rendered in the dropdown
            onChange={(event, value) => handleAutocompleteSelect(value, dataIndex)}
            // Other props for Autocomplete component
          />
        </Form.Item>
      );
    }

    return <Input />;
  };

  return (
    <td {...restProps}>
      {editing ? (
        renderInput()
      ) : (
        children
      )}
    </td>
  );
};

export default EditableCell;
