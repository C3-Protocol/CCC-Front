import React, { memo } from 'react'
import { useHistory } from 'react-router-dom'
import { PlusCircleOutlined } from '@ant-design/icons'

export default memo(function AddCollections(props) {
  const history = useHistory()
  const goToAddCollection = () => {
    history.push('/create/collection')
  }

  return (
    <div
      style={{
        minHeight: '300px',
        borderRadius: '8px',
        border: '2px dotted #A6AEB7',
        background: '#fff',
        flex: '0 0 360px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer'
      }}
      onClick={goToAddCollection}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', rowGap: '20px' }}>
        <div
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: '#A6AEB7',
            color: '#fff',
            fontSize: '40px',
            lineHeight: '56px',
            textAlign: 'center'
          }}
        >
          {'+'}
        </div>
        <div style={{ fontSize: '16px', fontWeight: 400, color: '#A6AEB7' }}>Create a collection </div>
      </div>
    </div>
  )
})
