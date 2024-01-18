import React from 'react'
import PropTypes from 'prop-types'

const CustomAvatar = ({ src, alt, size }) => {
  const avatarSizes = {
    xs: 'custom-avatar-xs',
    sm: 'custom-avatar-sm',
    md: 'custom-avatar-md',
    lg: 'custom-avatar-lg',
    xl: 'custom-avatar-xl',
  }
  return (
    <>
      <div className="custom-avatar">
        <img src={src} alt={alt} className={`${avatarSizes[size] || ''}`} />
      </div>
    </>
  )
}

CustomAvatar.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
}

export default CustomAvatar
