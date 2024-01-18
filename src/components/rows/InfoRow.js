import React from 'react'
import PropTypes from 'prop-types'

const InfoRow = ({ label, value }) => {
  return (
    <dl className="row mb-1">
      <dt className="col-sm-5">{label}</dt>
      <dd className="col-sm-7">{value}</dd>
    </dl>
  )
}

InfoRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
}

export default InfoRow
