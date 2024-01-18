import React from 'react'
import { CDropdownToggle } from '@coreui/react'
import PropTypes from 'prop-types'
import CIcon from '@coreui/icons-react'
import { cilOptions } from '@coreui/icons'

const CustomDropdownToggle = ({ ...rest }) => {
  return (
    <CDropdownToggle custom {...rest} style={{ background: 'transparent', border: 'none' }}>
      <button type="button" style={{ background: 'transparent', border: 'none', outline: 'none' }}>
        <CIcon icon={cilOptions} size="lg" />
      </button>
    </CDropdownToggle>
  )
}

CustomDropdownToggle.propTypes = {
  children: PropTypes.node,
}

export default CustomDropdownToggle
