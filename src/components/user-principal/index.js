import React, { memo } from 'react'
import { getUserNameByPrinId } from '@/api/userHandler'
import { useHistory, withRouter } from 'react-router-dom'

// wicp的额度显示
function UserPrincipal(props) {
  const history = useHistory()
  const maxLength = props.maxLength
  let user = props.prinId ? getUserNameByPrinId(props.prinId) : ''
  if (maxLength) {
    user = user.length > maxLength + 3 ? user.slice(0, maxLength) + '...' : user
  }
  const pathName = props.history.location.pathname
  return (
    <span
      className="ant-table-cell ant-table-cell-ellipsis"
      style={{ color: '#1890ff', cursor: 'pointer' }}
      onClick={(e) => {
        e.stopPropagation()
        if (props.prinId && pathName !== '/assets/account/myarts/' + props.prinId)
          history.push('/assets/account/myarts/' + props.prinId)
      }}
    >
      {user}
    </span>
  )
}

export default withRouter(UserPrincipal)
