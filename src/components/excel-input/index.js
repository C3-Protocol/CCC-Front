import { message } from 'antd'
import React, { memo, useRef } from 'react'
import * as XLSX from 'xlsx/dist/xlsx.min.js'

function ExcelInput(props) {
  const inputRef = useRef()
  const onSelectFileClick = () => {
    inputRef.current.focus()
    inputRef.current.click()
  }

  const onSelectFileChange = (e) => {
    const { files } = e.target
    // FileReader read
    const fileReader = new FileReader()
    fileReader.onload = (event) => {
      try {
        const { result } = event.target
        const workbook = XLSX.read(result, { type: 'binary' })
        let data = []
        for (const sheet in workbook.Sheets) {
          if (workbook.Sheets.hasOwnProperty(sheet)) {
            let res = XLSX.utils.sheet_to_json(workbook.Sheets[sheet], { header: 1 })
            data = data.concat(res)
            break
          }
        }
        props.onDataChange && props.onDataChange(data)
      } catch (e) {
        message.error('file type error')
        return
      }
    }
    fileReader.readAsBinaryString(files[0])
    inputRef.current.value = null
  }

  return (
    <div onClick={onSelectFileClick} style={{ display: 'flex', alignItems: 'center' }}>
      {props.children}
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx, .xls"
        style={{ display: 'none' }}
        className="needsclick"
        onChange={onSelectFileChange}
      />
    </div>
  )
}

export default memo(ExcelInput)
