'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineSearch } from 'react-icons/ai';
import { RxTriangleDown, RxCross2 } from 'react-icons/rx';
import { Filter, Mail, Edit, Trash2 } from 'lucide-react';
import { Form, Input, Button, Modal, message } from 'antd';
import useLanguage from '@/locale/useLanguage';
import axios from 'axios';

// Redux action for creating a user
const createUser = ({ userData }) => async (dispatch) => {
  dispatch({ type: 'USER_REQUEST' });
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_FILE_BASE_URL || 'http://localhost:3000/'}api/v1/user/create`,
      userData
    );
    if (response.data.success) {
      dispatch({
        type: 'USER_CREATE_SUCCESS',
        payload: { adminId: response.data.adminId },
      });
    } else {
      dispatch({
        type: 'USER_CREATE_FAIL',
        payload: response.data.message,
      });
    }
  } catch (error) {
    dispatch({
      type: 'USER_CREATE_FAIL',
      payload: error.response?.data?.message || 'User creation failed',
    });
  }
};

// Selector to access user state
const selectUser = (state) => state.user || { isLoading: false, isSuccess: false, error: null };

// CreateUserModal component
const CreateUserModal = ({ visible, onClose, onCreate }) => {
  const translate = useLanguage();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { isLoading, isSuccess, error } = useSelector(selectUser);

  useEffect(() => {
    if (isSuccess) {
      message.success(translate('User created successfully!'));
      form.resetFields();
      onCreate();
    }
    if (error) {
      message.error(translate(error));
    }
  }, [isSuccess, error, form, onCreate, translate]);

  const onFinish = (values) => {
    dispatch(createUser({ userData: values }));
  };

  return (
    <Modal
      title={translate('Create User')}
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
    >
      <Form
        form={form}
        layout="vertical"
        name="create_user_form"
        onFinish={onFinish}
      >
        <Form.Item
          label={translate('Name')}
          name="name"
          rules={[{ required: true, message: translate('Please input the name!') }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={translate('Surname')}
          name="surname"
          rules={[{ required: true, message: translate('Please input the surname!') }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={translate('Email')}
          name="email"
          rules={[
            { required: true, message: translate('Please input the email!') },
            { type: 'email', message: translate('Please enter a valid email!') },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={translate('Password')}
          name="password"
          rules={[{ required: true, message: translate('Please input the password!') }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label={translate('Role')}
          name="role"
          rules={[{ required: true, message: translate('Please select a role!') }]}
        >
          <select style={{ width: '100%', padding: '8px', borderRadius: '4px' }}>
            <option value="owner">Owner</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            style={{ width: '100%' }}
          >
            {translate('Create User')}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

const UserManagement = () => {
  const translate = useLanguage();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filterActive, setFilterActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState([]);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const roleRef = useRef(null);

  const VITE_FILE_BASE_URL = import.meta.env.VITE_FILE_BASE_URL || 'http://localhost:3000/';
  const authString = localStorage.getItem('auth');
  let token = '';
  if (authString) {
    try {
      const auth = JSON.parse(authString);
      token = auth?.current?.token || '';
    } catch (error) {
      console.error('Failed to parse auth from localStorage:', error);
    }
  }

  const roleOptions = [
    { id: 1, option: 'owner' },
    { id: 2, option: 'admin' },
    { id: 3, option: 'user' },
  ];

  const tableHeadings = [
    'Name',
    'Email',
    'Role',
    'Status',
    'Created At',
  ];

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const endpoint = filterActive ? 'get-active-users' : 'get-All';
      const response = await fetch(`${VITE_FILE_BASE_URL}api/v1/user/${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      let result = await response.json();
      if (result.success) {
        result = result.admins || [];
        if (searchTerm) {
          result = result.filter(
            (user) =>
              user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              user.email.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        if (roleFilter.length > 0) {
          result = result.filter((user) => roleFilter.includes(user.role));
        }
        setUsers(result);
      } else {
        console.error('Failed to fetch users:', result.message);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchUsers();
  };

  const handleRoleToggle = (item) => {
    setRoleFilter((prev) =>
      prev.includes(item.option)
        ? prev.filter((opt) => opt !== item.option)
        : [...prev, item.option]
    );
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const deleteUser = async (id) => {
    if (!confirm(translate('Are you sure you want to delete this user?'))) return;
    setLoading(true);
    try {
      const response = await fetch(`${VITE_FILE_BASE_URL}api/v1/user/delete/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (result.success) {
        fetchUsers();
        setSelectedUsers((prev) => prev.filter((userId) => userId !== id));
      } else {
        console.error('Failed to delete user:', result.message);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (id, isEnabled) => {
    setLoading(true);
    try {
      const endpoint = isEnabled ? 'disable' : 'enable';
      const response = await fetch(`${VITE_FILE_BASE_URL}api/v1/user/${endpoint}/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (result.success) {
        fetchUsers();
      } else {
        console.error(`Failed to ${isEnabled ? 'disable' : 'enable'} user:`, result.message);
      }
    } catch (error) {
      console.error(`Error ${isEnabled ? 'disabling' : 'enabling'} user:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setRoleFilter([]);
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, [filterActive, roleFilter]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (roleRef.current && !roleRef.current.contains(event.target)) {
        setIsRoleDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <main
      style={{
        fontFamily: 'Inter, sans-serif',
        minHeight: '95vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <section>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
          }}
        >
          <h1 style={{ fontSize: 20, fontWeight: 600 }}>{translate('User Management')}</h1>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ display: 'flex', background: '#318FFF66', padding: 3, borderRadius: 10 }}>
              <button
                onClick={() => setFilterActive(!filterActive)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '8px',
                  borderRadius: 10,
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: 'pointer',
                  background: '#fff',
                  border: 'none',
                }}
              >
                <Filter size={16} />
                <span>{filterActive ? 'Show All Users' : 'Show Active Users'}</span>
              </button>
            </div>
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: 10, padding: 16, marginBottom: 24 }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: 16,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                position: 'relative',
                flexGrow: 1,
                minWidth: 240,
                maxWidth: 340,
                border: '2px solid #e5e7eb',
                borderRadius: 10,
              }}
            >
              <input
                type="search"
                placeholder={translate('Search by Name/Email')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '92%',
                  padding: '8px',
                  fontSize: 14,
                  border: 'none',
                  outline: 'none',
                  color: '#222',
                  background: 'transparent',
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearch();
                }}
              />
              <AiOutlineSearch
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer',
                  width: 20,
                  height: 20,
                  color: '#222',
                }}
                onClick={handleSearch}
              />
            </div>

            <div style={{ position: 'relative' }} ref={roleRef}>
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.12))',
                  padding: 10,
                  borderRadius: 10,
                  fontSize: 14,
                  border: '1px solid #d1d5db',
                  cursor: 'pointer',
                }}
                onClick={() => setIsRoleDropdownOpen((p) => !p)}
              >
                <span style={{ fontSize: 14 }}>{translate('Role')}</span>
                <RxTriangleDown
                  size={16}
                  style={{
                    marginLeft: 12,
                    transform: isRoleDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s',
                  }}
                />
              </button>
              {isRoleDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    marginTop: 2,
                    top: '100%',
                    minWidth: 96,
                    background: '#fff',
                    border: '1px solid #2222',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    zIndex: 50,
                    maxHeight: 192,
                    borderRadius: 10,
                    overflowY: 'auto',
                  }}
                >
                  {roleOptions.map((item) => (
                    <p
                      key={item.id}
                      style={{
                        margin: 4,
                        padding: '4px 8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        fontSize: 12,
                        color: '#222',
                        background: roleFilter.includes(item.option) ? '#E9F5F0' : '#fff',
                        borderRadius: 6,
                      }}
                      onClick={() => handleRoleToggle(item)}
                    >
                      {item.option}
                    </p>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setShowCreateForm(true)}
              style={{
                position: 'relative',
                padding: '8px 16px',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 500,
                background: '#E96D70',
                color: '#fff',
                cursor: 'pointer',
                border: 'none',
              }}
            >
              {translate('Add User')}
              {selectedUsers.length > 0 && (
                <span
                  style={{
                    fontSize: 12,
                    position: 'absolute',
                    right: -16,
                    top: -16,
                    background: '#F4BB3F',
                    borderRadius: '50%',
                    width: 24,
                    height: 24,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 600,
                  }}
                >
                  {selectedUsers.length}
                </span>
              )}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
            <p style={{ fontSize: 14, whiteSpace: 'nowrap' }}>
              {translate('Showing results for')} {users.length.toLocaleString() || 0} {translate('Users')}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
              {roleFilter.map((role, i) => (
                <p
                  key={`role-${i}`}
                  style={{
                    background: '#F4BB3F',
                    borderRadius: 6,
                    color: '#fff',
                    padding: '2px 8px',
                    fontSize: 12,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <span>{role}</span>
                  <RxCross2
                    style={{
                      borderRadius: '50%',
                      position: 'relative',
                      top: -1,
                      border: '2px solid #fff',
                      padding: 1,
                      boxSizing: 'content-box',
                      cursor: 'pointer',
                    }}
                    size={10}
                    onClick={() => setRoleFilter((prev) => prev.filter((opt) => opt !== role))}
                  />
                </p>
              ))}
              {(searchTerm || roleFilter.length > 0) && (
                <button
                  type="button"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    marginLeft: 16,
                    cursor: 'pointer',
                    background: 'none',
                    border: 'none',
                  }}
                  onClick={handleClearFilters}
                >
                  <p style={{ fontSize: 14, fontWeight: 500, color: '#666' }}>{translate('Clear filters')}</p>
                  <RxCross2 size={17} style={{ color: '#666' }} />
                </button>
              )}
            </div>
          </div>
        </div>

        <div
          style={{
            background: '#F5F5F5',
            position: 'relative',
            padding: '20px 0',
            marginLeft: -32,
            marginRight: -32,
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {loading && users.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '40px 0', color: '#666', fontWeight: 500 }}>
              {translate('Loading...')}
            </p>
          ) : (
            <div
              style={{
                borderRadius: 10,
                border: '1px solid #76E4B6',
                marginLeft: 32,
                marginRight: 32,
                maxHeight: 430,
                overflowY: 'auto',
                width: '100%',
                overflowX: 'auto',
                background: '#fff',
              }}
            >
              <table
                style={{
                  minWidth: '100%',
                  borderCollapse: 'collapse',
                  width: users.length === 0 && !loading ? '100%' : undefined,
                  tableLayout: users.length === 0 && !loading ? 'fixed' : undefined,
                }}
              >
                <thead style={{ background: '#CDE4DA', position: 'sticky', top: 0, zIndex: 25 }}>
                  {users.length === 0 && !loading ? (
                    <tr>
                      <th
                        colSpan={7}
                        style={{
                          padding: '12px 16px',
                          fontSize: 12,
                          fontWeight: 600,
                          textAlign: 'center',
                        }}
                      >
                        <p>---</p>
                      </th>
                    </tr>
                  ) : (
                    <tr>
                      <th
                        style={{
                          padding: '12px 16px',
                          position: 'sticky',
                          left: 0,
                          zIndex: 50,
                          background: '#CDE4DA',
                        }}
                      ></th>
                      {tableHeadings.map((heading, i) => (
                        <th
                          key={i}
                          style={{
                            padding: '12px 16px',
                            textAlign: 'left',
                            fontSize: 12,
                            fontWeight: 600,
                            letterSpacing: 0.5,
                            whiteSpace: 'nowrap',
                            borderRight: '1px solid #2222',
                          }}
                        >
                          <span style={{ textTransform: 'uppercase' }}>{translate(heading)}</span>
                        </th>
                      ))}
                      <th
                        style={{
                          padding: '12px 16px',
                          textAlign: 'left',
                          fontSize: 12,
                          fontWeight: 600,
                          letterSpacing: 0.5,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {translate('Actions')}
                      </th>
                    </tr>
                  )}
                </thead>
                <tbody style={{ background: '#fff' }}>
                  {loading && users.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ padding: '32px 16px', textAlign: 'center' }}>
                        <p style={{ color: '#888', fontWeight: 500 }}>{translate('Loading...')}</p>
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        style={{
                          color: '#888',
                          fontWeight: 500,
                          padding: '32px 16px',
                          textAlign: 'center',
                        }}
                      >
                        <p>{translate('No Results Found.')}</p>
                        <p>{translate('Edit Filters to see updated results.')}</p>
                      </td>
                    </tr>
                  ) : (
                    users.map((user, index) => (
                      <tr key={index}>
                        <td style={{ background: '#fff' }}></td>
                        <td
                          style={{
                            background: '#fff',
                            padding: '16px',
                            borderRight: '1px solid #2222',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 8,
                              width: 'max-content',
                            }}
                          >
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <span
                                  style={{ fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap' }}
                                >
                                  {user.name} {user.surname || 'N/A'}
                                </span>
                              </div>
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  fontSize: 12,
                                  marginTop: 4,
                                  color: '#888',
                                  gap: 4,
                                }}
                              >
                                <Mail size={14} />
                                <span style={{ lineHeight: 1 }}>{user.email || 'N/A'}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td
                          style={{
                            padding: '16px',
                            fontSize: 14,
                            color: '#00000080',
                            borderRight: '1px solid #2222',
                          }}
                        >
                          {user.email || 'N/A'}
                        </td>
                        <td
                          style={{
                            padding: '16px',
                            fontSize: 14,
                            color: '#00000080',
                            borderRight: '1px solid #2222',
                          }}
                        >
                          {user.role || 'N/A'}
                        </td>
                        <td
                          style={{
                            padding: '16px',
                            fontSize: 14,
                            color: '#00000080',
                            borderRight: '1px solid #2222',
                          }}
                        >
                          {user.enabled ? 'Enabled' : 'Disabled'}
                        </td>
                        <td
                          style={{
                            padding: '16px',
                            fontSize: 14,
                            color: '#00000080',
                            borderRight: '1px solid #2222',
                          }}
                        >
                          {formatDate(user.createdAt)}
                        </td>
                        <td style={{ padding: '16px', fontSize: 14, color: '#00000080' }}>
                          <div style={{ display: 'flex', gap: 8 }}>
                            {/* <button
                              onClick={() => alert('Edit functionality not implemented yet')}
                              style={{
                                color: '#2563eb',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                              }}
                              title={translate('Edit User')}
                            >
                              <Edit size={18} />
                            </button> */}
                            {/* <button
                              onClick={() => deleteUser(user._id)}
                              style={{
                                color: '#e11d48',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                              }}
                              title={translate('Delete User')}
                            >
                              <Trash2 size={18} />
                            </button> */}
                            <button
                              onClick={() => toggleUserStatus(user._id, user.enabled)}
                              style={{
                                color: user.enabled ? '#f59e42' : '#22c55e',
                                background: 'none',
                                border: 'none',
                                fontSize: 12,
                                cursor: 'pointer',
                              }}
                              title={user.enabled ? translate('Disable User') : translate('Enable User')}
                            >
                              {user.enabled ? translate('Disable') : translate('Enable')}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                  {loading && users.length > 0 && (
                    <tr>
                      <td
                        colSpan="7"
                        style={{
                          textAlign: 'center',
                          padding: '32px 16px',
                          fontSize: 14,
                          color: '#888',
                          fontWeight: 500,
                          background: '#fff',
                        }}
                      ></td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          {loading && users.length > 0 && (
            <p
              style={{
                background: '#fff',
                position: 'absolute',
                bottom: 32,
                width: '94%',
                textAlign: 'center',
                fontSize: 14,
                padding: '16px 0',
                color: '#888',
                fontWeight: 500,
              }}
            >
              {translate('Loading...')}
            </p>
          )}
        </div>
      </section>

      {showCreateForm && (
        <CreateUserModal
          visible={showCreateForm}
          onClose={() => setShowCreateForm(false)}
          onCreate={() => {
            fetchUsers();
            setShowCreateForm(false);
          }}
        />
      )}
    </main>
  );
};

export default UserManagement;