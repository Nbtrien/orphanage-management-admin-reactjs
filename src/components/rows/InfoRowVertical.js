import React from 'react'
import PropTypes from 'prop-types'

const InfoRowVertical = ({ label, value }) => {
  return (
    <dl className="row mb-1">
      <dt className="col-sm-12">{label}</dt>
      <dd className="col-sm-12">{value}</dd>
    </dl>
  )
}

InfoRowVertical.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
}

export default InfoRowVertical
