// 'use client';

// import React, { useState, useEffect, useRef } from 'react';
// import { AiOutlineSearch } from 'react-icons/ai';
// import { RxTriangleDown, RxCross2 } from 'react-icons/rx';
// import { Filter, Mail } from 'lucide-react';
// import axios from 'axios';

// const CreateUserModal = ({ visible, onClose, onCreate, translate }) => {
//   const [formData, setFormData] = useState({ name: '', surname: '', email: '', password: '', role: '' });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!formData.name || !formData.surname || !formData.email || !formData.password || !formData.role) {
//       setError(translate('Please fill all fields'));
//       return;
//     }
//     setLoading(true);
//     try {
//       await axios.post(
//         `${import.meta.env.VITE_FILE_BASE_URL || 'http://localhost:3000/'}api/v1/user/create`,
//         formData
//       );
//       setFormData({ name: '', surname: '', email: '', password: '', role: '' });
//       onCreate();
//       onClose();
//     } catch (error) {
//       setError(error.response?.data?.message || translate('User creation failed'));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     setError(null);
//   };

//   if (!visible) return null;

//   return (
//     <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:9999}}>
//       <div style={{background:'#fff', borderRadius:8, padding:24, width:'100%', maxWidth:380, boxShadow:'0 2px 8px rgba(0,0,0,0.08)'}}>
//         <h2 style={{fontSize:18, fontWeight:600, marginBottom:16}}>{translate('Create User')}</h2>
//         {error && <p style={{color:'#e53e3e', fontSize:13, marginBottom:16}}>{error}</p>}
//         <form onSubmit={handleSubmit}>
//           <div style={{marginBottom:10}}>
//             <label style={{display:'block', fontSize:13, fontWeight:500, marginBottom:4}}>{translate('Name')}</label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               style={{width:'100%', padding:7, border:'1px solid #ccc', borderRadius:5, fontSize:14}}
//             />
//           </div>
//           <div style={{marginBottom:10}}>
//             <label style={{display:'block', fontSize:13, fontWeight:500, marginBottom:4}}>{translate('Surname')}</label>
//             <input
//               type="text"
//               name="surname"
//               value={formData.surname}
//               onChange={handleChange}
//               style={{width:'100%', padding:7, border:'1px solid #ccc', borderRadius:5, fontSize:14}}
//             />
//           </div>
//           <div style={{marginBottom:10}}>
//             <label style={{display:'block', fontSize:13, fontWeight:500, marginBottom:4}}>{translate('Email')}</label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               style={{width:'100%', padding:7, border:'1px solid #ccc', borderRadius:5, fontSize:14}}
//             />
//           </div>
//           <div style={{marginBottom:10}}>
//             <label style={{display:'block', fontSize:13, fontWeight:500, marginBottom:4}}>{translate('Password')}</label>
//             <input
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               style={{width:'100%', padding:7, border:'1px solid #ccc', borderRadius:5, fontSize:14}}
//             />
//           </div>
//           <div style={{marginBottom:10}}>
//             <label style={{display:'block', fontSize:13, fontWeight:500, marginBottom:4}}>{translate('Role')}</label>
//             <select
//               name="role"
//               value={formData.role}
//               onChange={handleChange}
//               style={{width:'100%', padding:7, border:'1px solid #ccc', borderRadius:5, fontSize:14}}
//             >
//               <option value="">{translate('Select a role')}</option>
//               <option value="owner">Owner</option>
//               <option value="admin">Admin</option>
//               <option value="user">User</option>
//             </select>
//           </div>
//           <div style={{display:'flex', gap:8, marginTop:12}}>
//             <button
//               type="button"
//               onClick={() => {
//                 setFormData({ name: '', surname: '', email: '', password: '', role: '' });
//                 onClose();
//               }}
//               style={{flex:1, padding:'7px 0', borderRadius:5, background:'#f3f3f3', color:'#333', border:'none', fontWeight:500, cursor:'pointer'}}
//             >
//               {translate('Cancel')}
//             </button>
//             <button
//               type="submit"
//               disabled={loading}
//               style={{flex:1, padding:'7px 0', borderRadius:5, background:loading?'#90cdf4':'#3182ce', color:'#fff', border:'none', fontWeight:500, cursor:loading?'not-allowed':'pointer'}}
//             >
//               {loading ? translate('Creating...') : translate('Create User')}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// const UserManagement = () => {
//   // Assuming useLanguage is a custom hook; replace with a simple object for demo purposes
//   const translate = (key) => {
//     const translations = {
//       'User Management': 'User Management',
//       'Show All Users': 'Show All Users',
//       'Show Active Users': 'Show Active Users',
//       'Search by Name/Email': 'Search by Name/Email',
//       'Role': 'Role',
//       'Add User': 'Add User',
//       'Showing results for': 'Showing results for',
//       'Users': 'Users',
//       'Clear filters': 'Clear filters',
//       'Loading...': 'Loading...',
//       'No Results Found.': 'No Results Found.',
//       'Edit Filters to see updated results.': 'Edit Filters to see updated results.',
//       'Name': 'Name',
//       'Email': 'Email',
//       'Status': 'Status',
//       'Created At': 'Created At',
//       'Actions': 'Actions',
//       'Disable': 'Disable',
//       'Enable': 'Enable',
//       'Create User': 'Create User',
//       'Please fill all fields': 'Please fill all fields',
//       'User creation failed': 'User creation failed',
//       'Cancel': 'Cancel',
//       'Creating...': 'Creating...',
//       'Select a role': 'Select a role',
//     };
//     return translations[key] || key;
//   };

//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [showCreateForm, setShowCreateForm] = useState(false);
//   const [filterActive, setFilterActive] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [roleFilter, setRoleFilter] = useState([]);
//   const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
//   const roleRef = useRef(null);

//   const VITE_FILE_BASE_URL = import.meta.env.VITE_FILE_BASE_URL || 'http://localhost:3000/';
//   const token = JSON.parse(localStorage.getItem('auth') || '{}')?.current?.token || '';

//   const roleOptions = [
//     { id: 1, option: 'owner' },
//     { id: 2, option: 'admin' },
//     { id: 3, option: 'user' },
//   ];

//   const tableHeadings = ['Name', 'Email', 'Role', 'Status', 'Created At'];

//   const fetchUsers = async () => {
//     setLoading(true);
//     try {
//       const endpoint = filterActive ? 'get-active-users' : 'get-All';
//       const response = await axios.get(`${VITE_FILE_BASE_URL}api/v1/user/${endpoint}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       let result = response.data.admins || [];
//       if (searchTerm) {
//         result = result.filter(
//           (user) =>
//             user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             user.email.toLowerCase().includes(searchTerm.toLowerCase())
//         );
//       }
//       if (roleFilter.length > 0) {
//         result = result.filter((user) => roleFilter.includes(user.role));
//       }
//       setUsers(result);
//     } catch (error) {
//       console.error('Error fetching users:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleUserStatus = async (id, isEnabled) => {
//     setLoading(true);
//     try {
//       const endpoint = isEnabled ? 'disable' : 'enable';
//       await axios.put(`${VITE_FILE_BASE_URL}api/v1/user/${endpoint}/${id}`, null, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       fetchUsers();
//     } catch (error) {
//       console.error(`Error ${isEnabled ? 'disabling' : 'enabling'} user:`, error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRoleToggle = (item) => {
//     setRoleFilter((prev) =>
//       prev.includes(item.option)
//         ? prev.filter((opt) => opt !== item.option)
//         : [...prev, item.option]
//     );
//   };

//   const handleClearFilters = () => {
//     setSearchTerm('');
//     setRoleFilter([]);
//     fetchUsers();
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, [filterActive, roleFilter]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (roleRef.current && !roleRef.current.contains(event.target)) {
//         setIsRoleDropdownOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const formatDate = (dateString) =>
//     dateString
//       ? new Date(dateString).toLocaleDateString('en-US', {
//           year: 'numeric',
//           month: 'short',
//           day: 'numeric',
//           hour: '2-digit',
//           minute: '2-digit',
//         })
//       : 'N/A';

//   return (
//     <main style={{minHeight:'100vh', fontFamily:'sans-serif', padding:16, background:'#f7f7f7'}}>
//       <section>
//         <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18}}>
//           <h1 style={{fontSize:20, fontWeight:600}}>{translate('User Management')}</h1>
//           <div>
//             <button
//               onClick={() => setFilterActive(!filterActive)}
//               style={{display:'flex', alignItems:'center', gap:6, padding:'6px 14px', borderRadius:7, background:'#e3f0ff', color:'#2563eb', fontWeight:500, fontSize:13, border:'none', cursor:'pointer'}}
//             >
//               <Filter size={16} />
//               {filterActive ? translate('Show All Users') : translate('Show Active Users')}
//             </button>
//           </div>
//         </div>

//         <div style={{background:'#fff', borderRadius:8, padding:16, marginBottom:24, boxShadow:'0 1px 4px rgba(0,0,0,0.04)'}}>
//           <div style={{display:'flex', flexWrap:'wrap', alignItems:'center', gap:12, marginBottom:16}}>
//             <div style={{position:'relative', flexGrow:1, minWidth:180, maxWidth:320, border:'1.5px solid #e5e7eb', borderRadius:7}}>
//               <input
//                 type="search"
//                 placeholder={translate('Search by Name/Email')}
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 style={{width:'100%', padding:8, background:'transparent', outline:'none', color:'#222', fontSize:14, border:'none'}}
//                 onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
//               />
//               <AiOutlineSearch
//                 style={{position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', cursor:'pointer', color:'#222'}}
//                 size={20}
//                 onClick={fetchUsers}
//               />
//             </div>

//             <div style={{position:'relative'}} ref={roleRef}>
//               <button
//                 onClick={() => setIsRoleDropdownOpen((p) => !p)}
//                 style={{display:'flex', alignItems:'center', gap:6, padding:'6px 14px', borderRadius:7, border:'1px solid #d1d5db', background:'linear-gradient(to bottom, #fff, #f3f3f3)', fontSize:13, cursor:'pointer'}}
//               >
//                 <span>{translate('Role')}</span>
//                 <RxTriangleDown
//                   size={16}
//                   style={{marginLeft:6, transition:'transform 0.2s', transform: isRoleDropdownOpen ? 'rotate(180deg)' : 'none'}}
//                 />
//               </button>
//               {isRoleDropdownOpen && (
//                 <div style={{position:'absolute', marginTop:4, top:'100%', minWidth:90, background:'#fff', border:'1px solid #e5e7eb', boxShadow:'0 2px 8px rgba(0,0,0,0.08)', borderRadius:7, maxHeight:160, overflowY:'auto', zIndex:99}}>
//                   {roleOptions.map((item) => (
//                     <p
//                       key={item.id}
//                       onClick={() => handleRoleToggle(item)}
//                       style={{margin:4, padding:7, display:'flex', justifyContent:'space-between', alignItems:'center', cursor:'pointer', fontSize:13, color:'#222', borderRadius:5, background: roleFilter.includes(item.option) ? '#d1fae5' : 'transparent'}}
//                     >
//                       {item.option}
//                     </p>
//                   ))}
//                 </div>
//               )}
//             </div>

//             <button
//               onClick={() => setShowCreateForm(true)}
//               style={{padding:'7px 18px', borderRadius:7, background:'#ef4444', color:'#fff', fontWeight:500, fontSize:13, border:'none', cursor:'pointer'}}
//             >
//               {translate('Add User')}
//             </button>
//           </div>

//           <div style={{display:'flex', flexDirection:'column', gap:6}}>
//             <p style={{fontSize:13}}>
//               {translate('Showing results for')} {users.length.toLocaleString() || 0} {translate('Users')}
//             </p>
//             <div style={{display:'flex', flexWrap:'wrap', gap:8, alignItems:'center'}}>
//               {roleFilter.map((role, i) => (
//                 <p
//                   key={`role-${i}`}
//                   style={{background:'#facc15', color:'#fff', padding:'2px 8px', borderRadius:5, fontSize:11, display:'flex', alignItems:'center', gap:4, marginBottom:2}}
//                 >
//                   <span>{role}</span>
//                   <RxCross2
//                     size={10}
//                     style={{border:'1.5px solid #fff', borderRadius:'50%', padding:1, cursor:'pointer'}}
//                     onClick={() => setRoleFilter((prev) => prev.filter((opt) => opt !== role))}
//                   />
//                 </p>
//               ))}
//               {(searchTerm || roleFilter.length > 0) && (
//                 <button
//                   onClick={handleClearFilters}
//                   style={{display:'flex', alignItems:'center', gap:4, marginLeft:10, background:'none', border:'none', cursor:'pointer'}}
//                 >
//                   <span style={{fontSize:13, fontWeight:500, color:'#666'}}>{translate('Clear filters')}</span>
//                   <RxCross2 size={17} style={{color:'#666'}} />
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>

//         <div style={{background:'', position:'relative', padding:20, marginLeft:-24, marginRight:-24}}>
//           {loading && users.length === 0 ? (
//             <p style={{textAlign:'center', padding:'40px 0', color:'#666', fontWeight:500}}>{translate('Loading...')}</p>
//           ) : (
//             <div style={{borderRadius:8, border:'1.5px solid #6ee7b7', marginLeft:24, marginRight:24, maxHeight:430, overflowY:'auto', overflowX:'auto', background:'#fff'}}>
//               <table style={{minWidth:'100%', borderCollapse:'collapse', fontSize:13}}>
//                 <thead style={{background:'#d1fae5', position:'sticky', top:0, zIndex:10}}>
//                   {users.length === 0 && !loading ? (
//                     <tr>
//                       <th style={{padding:10, fontSize:13, fontWeight:600, textAlign:'center'}} colSpan={7}>
//                         ---
//                       </th>
//                     </tr>
//                   ) : (
//                     <tr>
//                       <th style={{padding:10, position:'sticky', left:0, zIndex:20, background:'#d1fae5'}}></th>
//                       {tableHeadings.map((heading, i) => (
//                         <th
//                           key={i}
//                           style={{padding:10, textAlign:'left', fontSize:11, fontWeight:600, textTransform:'uppercase', borderRight:'1px solid #e5e7eb', background:'#d1fae5'}}
//                         >
//                           {translate(heading)}
//                         </th>
//                       ))}
//                       <th style={{padding:10, textAlign:'left', fontSize:11, fontWeight:600, textTransform:'uppercase', background:'#d1fae5'}}>{translate('Actions')}</th>
//                     </tr>
//                   )}
//                 </thead>
//                 <tbody style={{background:'#fff'}}>
//                   {loading && users.length === 0 ? (
//                     <tr>
//                       <td colSpan="7" style={{padding:32, textAlign:'center', color:'#888', fontWeight:500}}>
//                         {translate('Loading...')}
//                       </td>
//                     </tr>
//                   ) : users.length === 0 ? (
//                     <tr>
//                       <td colSpan="7" style={{padding:32, textAlign:'center', color:'#888', fontWeight:500}}>
//                         <p>{translate('No Results Found.')}</p>
//                         <p>{translate('Edit Filters to see updated results.')}</p>
//                       </td>
//                     </tr>
//                   ) : (
//                     users.map((user, index) => (
//                       <tr key={index}>
//                         <td style={{background:'#fff'}}></td>
//                         <td style={{padding:14, borderRight:'1px solid #e5e7eb'}}>
//                           <div style={{display:'flex', alignItems:'center', gap:6}}>
//                             <div>
//                               <div style={{display:'flex', alignItems:'center', gap:3, fontSize:13, fontWeight:500}}>
//                                 {user.name} {user.surname || 'N/A'}
//                               </div>
//                               <div style={{display:'flex', alignItems:'center', gap:3, marginTop:2, fontSize:11, color:'#888'}}>
//                                 <Mail size={14} />
//                                 {user.email || 'N/A'}
//                               </div>
//                             </div>
//                           </div>
//                         </td>
//                         <td style={{padding:14, color:'#888', borderRight:'1px solid #e5e7eb'}}>
//                           {user.email || 'N/A'}
//                         </td>
//                         <td style={{padding:14, color:'#888', borderRight:'1px solid #e5e7eb'}}>
//                           {user.role || 'N/A'}
//                         </td>
//                         <td style={{padding:14, color:'#888', borderRight:'1px solid #e5e7eb'}}>
//                           {user.enabled ? 'Enabled' : 'Disabled'}
//                         </td>
//                         <td style={{padding:14, color:'#888', borderRight:'1px solid #e5e7eb'}}>
//                           {formatDate(user.createdAt)}
//                         </td>
//                         <td style={{padding:14, color:'#888'}}>
//                           <button
//                             onClick={() => toggleUserStatus(user._id, user.enabled)}
//                             style={{color:user.enabled?'#f59e42':'#22c55e', background:'none', border:'none', fontWeight:500, fontSize:11, cursor:'pointer'}}
//                           >
//                             {user.enabled ? translate('Disable') : translate('Enable')}
//                           </button>
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                   {loading && users.length > 0 && (
//                     <tr>
//                       <td colSpan="7" style={{padding:32, textAlign:'center', color:'#888', fontWeight:500}}></td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           )}
//           {loading && users.length > 0 && (
//             <p style={{position:'absolute', bottom:32, width:'94%', textAlign:'center', fontSize:13, color:'#888', fontWeight:500, background:'#fff', padding:'16px 0'}}>
//               {translate('Loading...')}
//             </p>
//           )}
//         </div>
//       </section>

//       <CreateUserModal
//         visible={showCreateForm}
//         onClose={() => setShowCreateForm(false)}
//         onCreate={fetchUsers}
//         translate={translate}
//       />
//     </main>
//   );
// };

// export default UserManagement;

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { RxTriangleDown, RxCross2 } from 'react-icons/rx';
import { Filter, Mail } from 'lucide-react';
import axios from 'axios';

const CreateUserModal = ({ visible, onClose, onCreate, translate }) => {
  const [formData, setFormData] = useState({ name: '', surname: '', email: '', password: '', role: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.surname || !formData.email || !formData.password || !formData.role) {
      setError(translate('Please fill all fields'));
      return;
    }
    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_FILE_BASE_URL || 'http://localhost:3000/'}api/v1/user/create`,
        formData
      );
      setFormData({ name: '', surname: '', email: '', password: '', role: '' });
      onCreate();
      onClose();
    } catch (error) {
      setError(error.response?.data?.message || translate('User creation failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  if (!visible) return null;

  return (
    <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:9999}}>
      <div style={{background:'#fff', borderRadius:8, padding:24, width:'100%', maxWidth:380, boxShadow:'0 2px 8px rgba(0,0,0,0.08)'}}>
        <h2 style={{fontSize:18, fontWeight:600, marginBottom:16}}>{translate('Create User')}</h2>
        {error && <p style={{color:'#e53e3e', fontSize:13, marginBottom:16}}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom:10}}>
            <label style={{display:'block', fontSize:13, fontWeight:500, marginBottom:4}}>{translate('Name')}</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={{width:'100%', padding:7, border:'1px solid #ccc', borderRadius:5, fontSize:14}}
            />
          </div>
          <div style={{marginBottom:10}}>
            <label style={{display:'block', fontSize:13, fontWeight:500, marginBottom:4}}>{translate('Surname')}</label>
            <input
              type="text"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              style={{width:'100%', padding:7, border:'1px solid #ccc', borderRadius:5, fontSize:14}}
            />
          </div>
          <div style={{marginBottom:10}}>
            <label style={{display:'block', fontSize:13, fontWeight:500, marginBottom:4}}>{translate('Email')}</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{width:'100%', padding:7, border:'1px solid #ccc', borderRadius:5, fontSize:14}}
            />
          </div>
          <div style={{marginBottom:10}}>
            <label style={{display:'block', fontSize:13, fontWeight:500, marginBottom:4}}>{translate('Password')}</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={{width:'100%', padding:7, border:'1px solid #ccc', borderRadius:5, fontSize:14}}
            />
          </div>
          <div style={{marginBottom:10}}>
            <label style={{display:'block', fontSize:13, fontWeight:500, marginBottom:4}}>{translate('Role')}</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={{width:'100%', padding:7, border:'1px solid #ccc', borderRadius:5, fontSize:14}}
            >
              <option value="">{translate('Select a role')}</option>
              <option value="owner">Owner</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
          <div style={{display:'flex', gap:8, marginTop:12}}>
            <button
              type="button"
              onClick={() => {
                setFormData({ name: '', surname: '', email: '', password: '', role: '' });
                onClose();
              }}
              style={{flex:1, padding:'7px 0', borderRadius:5, background:'#f3f3f3', color:'#333', border:'none', fontWeight:500, cursor:'pointer'}}
            >
              {translate('Cancel')}
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{flex:1, padding:'7px 0', borderRadius:5, background:loading?'#90cdf4':'#3182ce', color:'#fff', border:'none', fontWeight:500, cursor:loading?'not-allowed':'pointer'}}
            >
              {loading ? translate('Creating...') : translate('Create User')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const UserManagement = () => {
  // Assuming useLanguage is a custom hook; replace with a simple object for demo purposes
  const translate = (key) => {
    const translations = {
      'User Management': 'User Management',
      'Show All Users': 'Show All Users',
      'Show Active Users': 'Show Active Users',
      'Search by Name/Email': 'Search by Name/Email',
      'Role': 'Role',
      'Add User': 'Add User',
      'Showing results for': 'Showing results for',
      'Users': 'Users',
      'Clear filters': 'Clear filters',
      'Loading...': 'Loading...',
      'No Results Found.': 'No Results Found.',
      'Edit Filters to see updated results.': 'Edit Filters to see updated results.',
      'Name': 'Name',
      'Email': 'Email',
      'Status': 'Status',
      'Created At': 'Created At',
      'Actions': 'Actions',
      'Disable': 'Disable',
      'Enable': 'Enable',
      'Create User': 'Create User',
      'Please fill all fields': 'Please fill all fields',
      'User creation failed': 'User creation failed',
      'Cancel': 'Cancel',
      'Creating...': 'Creating...',
      'Select a role': 'Select a role',
    };
    return translations[key] || key;
  };

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filterActive, setFilterActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState([]);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const roleRef = useRef(null);

  const VITE_FILE_BASE_URL = import.meta.env.VITE_FILE_BASE_URL || 'http://localhost:3000/';
  const token = JSON.parse(localStorage.getItem('auth') || '{}')?.current?.token || '';

  const roleOptions = [
    { id: 1, option: 'owner' },
    { id: 2, option: 'admin' },
    { id: 3, option: 'user' },
  ];

  const tableHeadings = ['Name', 'Email', 'Role', 'Status', 'Created At'];

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const endpoint = filterActive ? 'get-active-users' : 'get-All';
      const response = await axios.get(`${VITE_FILE_BASE_URL}api/v1/user/${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      let result = response.data.admins || [];
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
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (id, isEnabled) => {
    setLoading(true);
    try {
      const endpoint = isEnabled ? 'disable' : 'enable';
      await axios.put(`${VITE_FILE_BASE_URL}api/v1/user/${endpoint}/${id}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (error) {
      console.error(`Error ${isEnabled ? 'disabling' : 'enabling'} user:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleToggle = (item) => {
    setRoleFilter((prev) =>
      prev.includes(item.option)
        ? prev.filter((opt) => opt !== item.option)
        : [...prev, item.option]
    );
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

  const formatDate = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : 'N/A';

  return (
    <main style={{minHeight:'100vh', fontFamily:'sans-serif', padding:16, background:''}}>
      <section>
        {/* <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18}}>
          <h1 style={{fontSize:20, fontWeight:600}}>{translate('User Management')}</h1>
          <div>
            <button
              onClick={() => setFilterActive(!filterActive)}
              style={{display:'flex', alignItems:'center', gap:6, padding:'6px 14px', borderRadius:7, background:'#e3f0ff', color:'#2563eb', fontWeight:500, fontSize:13, border:'none', cursor:'pointer'}}
            >
              <Filter size={16} />
              {filterActive ? translate('Show All Users') : translate('Show Active Users')}
            </button>
          </div>
        </div> */}

        <div style={{background:'#fff', borderRadius:8, padding:8, marginBottom:24, boxShadow:'0 1px 4px rgba(0,0,0,0.04)'}}>
          <div style={{display:'flex', flexWrap:'wrap', alignItems:'center', gap:12, marginBottom:16}}>
            <div style={{position:'relative', flexGrow:1, minWidth:180, maxWidth:320, border:'1.5px solid #e5e7eb', borderRadius:7}}>
              <input
                type="search"
                placeholder={translate('Search by Name/Email')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{width:'100%', padding:8, background:'transparent', outline:'none', color:'#222', fontSize:14, border:'none'}}
                onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
              />
              <AiOutlineSearch
                style={{position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', cursor:'pointer', color:'#222'}}
                size={20}
                onClick={fetchUsers}
              />
            </div>

            <div style={{position:'relative'}} ref={roleRef}>
              <button
                onClick={() => setIsRoleDropdownOpen((p) => !p)}
                style={{display:'flex', alignItems:'center', gap:6, padding:'6px 14px', borderRadius:7, border:'1px solid #d1d5db', background:'linear-gradient(to bottom, #fff, #f3f3f3)', fontSize:13, cursor:'pointer'}}
              >
                <span>{translate('Role')}</span>
                <RxTriangleDown
                  size={16}
                  style={{marginLeft:6, transition:'transform 0.2s', transform: isRoleDropdownOpen ? 'rotate(180deg)' : 'none'}}
                />
              </button>
              {isRoleDropdownOpen && (
                <div style={{position:'absolute', marginTop:4, top:'100%', minWidth:90, background:'#fff', border:'1px solid #e5e7eb', boxShadow:'0 2px 8px rgba(0,0,0,0.08)', borderRadius:7, maxHeight:160, overflowY:'auto', zIndex:99}}>
                  {roleOptions.map((item) => (
                    <p
                      key={item.id}
                      onClick={() => handleRoleToggle(item)}
                      style={{margin:4, padding:7, display:'flex', justifyContent:'space-between', alignItems:'center', cursor:'pointer', fontSize:13, color:'#222', borderRadius:5, background: roleFilter.includes(item.option) ? '' : 'transparent'}}
                    >
                      {item.option}
                    </p>
                  ))}
                </div>
              )}

              
            </div>

            <button
              onClick={() => setShowCreateForm(true)}
              style={{padding:'7px 18px', borderRadius:7, background:'#52A19e', color:'#fff', fontWeight:500, fontSize:13, border:'none', cursor:'pointer'}}
            >
              {translate('Add User')}
            </button>

              {/* <div>
            <button
              onClick={() => setFilterActive(!filterActive)}
              style={{display:'flex', alignItems:'center', gap:6, padding:'6px 14px', borderRadius:7, background:'#e3f0ff', color:'#2563eb', fontWeight:500, fontSize:13, border:'none', cursor:'pointer'}}
            >
              <Filter size={16} />
              {filterActive ? translate('Show All Users') : translate('Show Active Users')}
            </button>
          </div> */}
          </div>

          <div style={{display:'flex', flexDirection:'column', gap:6}}>
            <p style={{fontSize:13}}>
              {translate('Showing results for')} {users.length.toLocaleString() || 0} {translate('Users')}
            </p>
            <div style={{display:'flex', flexWrap:'wrap', gap:8, alignItems:'center'}}>
              {roleFilter.map((role, i) => (
                <p
                  key={`role-${i}`}
                  style={{background:'#facc15', color:'#fff', padding:'2px 8px', borderRadius:5, fontSize:11, display:'flex', alignItems:'center', gap:4, marginBottom:2}}
                >
                  <span>{role}</span>
                  <RxCross2
                    size={10}
                    style={{border:'1.5px solid #fff', borderRadius:'50%', padding:1, cursor:'pointer'}}
                    onClick={() => setRoleFilter((prev) => prev.filter((opt) => opt !== role))}
                  />
                </p>
              ))}
              {(searchTerm || roleFilter.length > 0) && (
                <button
                  onClick={handleClearFilters}
                  style={{display:'flex', alignItems:'center', gap:4, marginLeft:10, background:'none', border:'none', cursor:'pointer'}}
                >
                  <span style={{fontSize:13, fontWeight:500, color:'#666'}}>{translate('Clear filters')}</span>
                  <RxCross2 size={17} style={{color:'#666'}} />
                </button>
              )}
            </div>
          </div>
        </div>

        <div style={{background:'', position:'relative', padding:0, marginLeft:-24, marginRight:-24}}>
          {loading && users.length === 0 ? (
            <p style={{textAlign:'center', padding:'40px 0', color:'#666', fontWeight:500}}>{translate('Loading...')}</p>
          ) : (
            <div style={{borderRadius:8, border:'1.5px solid #f5f5f5', marginLeft:24, marginRight:24, maxHeight:430, overflowY:'auto', overflowX:'auto', background:'#fff'}}>
              <table style={{minWidth:'100%', borderCollapse:'collapse', fontSize:13}}>
                <thead style={{background:'#f5f5f5', position:'sticky', top:0, zIndex:10}}>
                  {users.length === 0 && !loading ? (
                    <tr>
                      <th style={{padding:10, fontSize:13, fontWeight:600, textAlign:'center'}} colSpan={7}>
                        ---
                      </th>
                    </tr>
                  ) : (
                    <tr>
                      <th style={{padding:10, position:'sticky', left:0, zIndex:20, background:''}}></th>
                      {tableHeadings.map((heading, i) => (
                        <th
                          key={i}
                          style={{padding:10, textAlign:'left', fontSize:11, fontWeight:600, textTransform:'uppercase', borderRight:'1px solid #e5e7eb', background:''}}
                        >
                          {translate(heading)}
                        </th>
                      ))}
                      <th style={{padding:10, textAlign:'left', fontSize:11, fontWeight:600, textTransform:'uppercase', background:''}}>{translate('Actions')}</th>
                    </tr>
                  )}
                </thead>
                <tbody style={{background:'#fff'}}>
                  {loading && users.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{padding:32, textAlign:'center', color:'#888', fontWeight:500}}>
                        {translate('Loading...')}
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{padding:32, textAlign:'center', color:'#888', fontWeight:500}}>
                        <p>{translate('No Results Found.')}</p>
                        <p>{translate('Edit Filters to see updated results.')}</p>
                      </td>
                    </tr>
                  ) : (
                    users.map((user, index) => (
                      <tr key={index}>
                        <td style={{background:'#fff'}}></td>
                        <td style={{padding:14, borderRight:'1px solid #e5e7eb'}}>
                          <div style={{display:'flex', alignItems:'center', gap:6}}>
                            <div>
                              <div style={{display:'flex', alignItems:'center', gap:3, fontSize:13, fontWeight:500}}>
                                {user.name} {user.surname || 'N/A'}
                              </div>
                              <div style={{display:'flex', alignItems:'center', gap:3, marginTop:2, fontSize:11, color:'#888'}}>
                                <Mail size={14} />
                                {user.email || 'N/A'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td style={{padding:14, color:'#888', borderRight:'1px solid #e5e7eb'}}>
                          {user.email || 'N/A'}
                        </td>
                        <td style={{padding:14, color:'#888', borderRight:'1px solid #e5e7eb'}}>
                          {user.role || 'N/A'}
                        </td>
                        <td style={{padding:14, color:'#888', borderRight:'1px solid #e5e7eb'}}>
                          {user.enabled ? 'Enabled' : 'Disabled'}
                        </td>
                        <td style={{padding:14, color:'#888', borderRight:'1px solid #e5e7eb'}}>
                          {formatDate(user.created)}
                        </td>
                        <td style={{padding:14, color:'#888'}}>
                          <button
                            onClick={() => toggleUserStatus(user._id, user.enabled)}
                            style={{color:user.enabled?'#f59e42':'#22c55e', background:'none', border:'none', fontWeight:500, fontSize:11, cursor:'pointer'}}
                          >
                            {user.enabled ? translate('Disable') : translate('Enable')}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                  {loading && users.length > 0 && (
                    <tr>
                      <td colSpan="7" style={{padding:32, textAlign:'center', color:'#888', fontWeight:500}}></td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          {loading && users.length > 0 && (
            <p style={{position:'absolute', bottom:32, width:'94%', textAlign:'center', fontSize:13, color:'#888', fontWeight:500, background:'#fff', padding:'16px 0'}}>
              {translate('Loading...')}
            </p>
          )}
        </div>
      </section>

      <CreateUserModal
        visible={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onCreate={fetchUsers}
        translate={translate}
      />
    </main>
  );
};

export default UserManagement;