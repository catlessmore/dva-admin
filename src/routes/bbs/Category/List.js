import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Menu } from 'antd'
import styles from './List.less'
import { DataTable, DropMenu } from '../../../components/'
import { UPDATE, DELETE } from '../../../constants/options'

const confirm = Modal.confirm

function List ({
  bbsCategory: {
    list,
    pagination,
  },
  loading,
  updatePower,
  deletePower,
  onDeleteItem,
  onEditItem,
  location,
}) {
  const handleDeleteItem = (record) => {
    confirm({
      title: '您确定要删除这条记录吗?',
      onOk () {
        onDeleteItem(record.cid)
      },
    })
  }

  const handleMenuClick = (key, record) => {
    return {
      [UPDATE]: onEditItem,
      [DELETE]: handleDeleteItem,
    }[key](record)
  }

  const columns = [
    {
      title: '分类编号',
      dataIndex: 'cid',
      key: 'cid',
    }, {
      title: '分类图标',
      dataIndex: 'avatar',
      key: 'avatar',
      render (avatar) {
        return <img className={styles.avatar} src={avatar} alt={avatar} />
      },
    }, {
      title: '分类名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '操作',
      key: 'operation',
      // width: 100,
      render: (text, record) => (
        <DropMenu>
          <Menu onClick={({ key }) => handleMenuClick(key, record)}>
            {updatePower && <Menu.Item key={UPDATE}>编辑</Menu.Item>}
            {deletePower && <Menu.Item key={DELETE}>删除</Menu.Item>}
          </Menu>
        </DropMenu>
      ),
      // fixed: 'right'
    },
  ]

  let total = pagination.total

  const getFilterList = () => {
    const { field, keyword, current, pageSize } = location.query
    const currentPage = current || pagination.current
    const sizePage = pageSize || pagination.pageSize

    if (field) {
      const filterTotalList = list.filter(item => item[field].indexOf(decodeURI(keyword)) > -1)
      total = filterTotalList.length
      const filterList = filterTotalList.slice((currentPage - 1) * (sizePage), currentPage * sizePage)
      return filterList
    }
    return list
  }

  const tableProps = {
    dataSource: getFilterList(),
    columns,
    loading,
    className: styles.table,
    pagination: { ...pagination, total },
    rowKey: record => record.cid,
  }

  return (
    <DataTable {...tableProps} />
  )
}

List.propTypes = {
  location: PropTypes.object.isRequired,
  bbsCategory: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  updatePower: PropTypes.bool.isRequired,
  deletePower: PropTypes.bool.isRequired,
  onDeleteItem: PropTypes.func.isRequired,
  onEditItem: PropTypes.func.isRequired,
}

export default List
