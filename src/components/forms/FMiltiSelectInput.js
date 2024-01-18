import React from 'react'
import PropTypes from 'prop-types'
import Multiselect from 'multiselect-react-dropdown'

const FMultiSelectInput = ({ id, label, onChange, options, value }) => {
  return (
    <>
      <Multiselect
        placeholder={''}
        id={id}
        options={options}
        selectedValues={value}
        onSelect={onChange}
        onRemove={onChange}
        displayValue="name"
      />
    </>
  )
}

FMultiSelectInput.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ),
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
}

export default FMultiSelectInput
