// import React, { useState } from 'react';
// import { RxCross2 } from 'react-icons/rx';

// const statusOptions = [
//   { id: 1, option: 'Not Sure' },
//   { id: 2, option: 'Completed' },
//   { id: 3, option: 'Under Conversation' },
//   { id: 4, option: 'Deal Closed' },
//   { id: 5, option: 'Under Process' },
// ];

// const sourceOptions = [
//   { id: 1, option: 'LinkedIn' },
//   { id: 2, option: 'Facebook' },
//   { id: 3, option: 'Website' },
//   { id: 4, option: 'Referral' },
//   { id: 5, option: 'Other' },
// ];

// const CreateLeadModal = ({ onClose, onCreate }) => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     contactNo: '',
//     source: 'LinkedIn',
//     status: 'Not Sure',
//     remark: '',
//     notes: '',
//     industry: '',
//     Address: { detail: '', pinCode: '', city: '', country: 'India' },
//     documents: null,
//   });
//   const [formError, setFormError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const VITE_FILE_BASE_URL = import.meta.env.VITE_FILE_BASE_URL || 'http://localhost:3000/';
//   const authString = localStorage.getItem('auth');
//   let token = '';
//   if (authString) {
//     try {
//       const auth = JSON.parse(authString);
//       token = auth?.current?.token || '';
//     } catch (error) {
//       console.error('Failed to parse auth from localStorage:', error);
//     }
//   }

//   const createLead = async () => {
//     if (
//       !formData.name ||
//       !formData.email ||
//       !formData.contactNo ||
//       !formData.source ||
//       !formData.documents
//     ) {
//       setFormError('Name, Email, Contact Number, Source, and Documents are required');
//       return;
//     }

//     setLoading(true);
//     setFormError('');
//     try {
//       const formDataToSend = new FormData();
//       Object.entries(formData).forEach(([key, value]) => {
//         if (key === 'Address') {
//           formDataToSend.append('Address', JSON.stringify(value));
//         } else if (key === 'documents' && value) {
//           formDataToSend.append('documents', value);
//         } else if (value && key !== 'documents') {
//           formDataToSend.append(key, value);
//         }
//       });

//       const response = await fetch(`${VITE_FILE_BASE_URL}api/v1/lead/create`, {
//         method: 'POST',
//         headers: { Authorization: `Bearer ${token}` },
//         body: formDataToSend,
//       });

//       const result = await response.json();
//       if (result.success) {
//         onCreate();
//       } else {
//         setFormError(result.message || 'Failed to create lead');
//       }
//     } catch (error) {
//       console.error('Error creating lead:', error);
//       setFormError('Failed to create lead');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value, files } = e.target;
//     if (name === 'documents') {
//       setFormData((prev) => ({ ...prev, documents: files[0] }));
//     } else if (name.startsWith('Address.')) {
//       const addressField = name.split('.')[1];
//       setFormData((prev) => ({
//         ...prev,
//         Address: { ...prev.Address, [addressField]: value },
//       }));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   return (
//     <div
//       style={{
//         position: 'fixed',
//         top: 0,
//         left: 0,
//         width: '100vw',
//         height: '100vh',
//         background: 'rgba(0,0,0,0.5)',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         padding: 16,
//         zIndex: 9999,
//       }}
//     >
//       <div
//         style={{
//           background: '#fff',
//           borderRadius: 16,
//           maxWidth: 700,
//           width: '100%',
//           maxHeight: '90vh',
//           overflowY: 'auto',
//           boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
//         }}
//       >
//         <div
//           style={{
//             padding: 24,
//             borderBottom: '1px solid #e5e7eb',
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//           }}
//         >
//           <h2 style={{ fontSize: 24, fontWeight: 700, color: '#222' }}>Create New Lead</h2>
//           <button
//             onClick={onClose}
//             style={{
//               padding: 8,
//               color: '#888',
//               background: 'transparent',
//               border: 'none',
//               borderRadius: 8,
//               cursor: 'pointer',
//               transition: 'background 0.2s',
//             }}
//             onMouseOver={(e) => (e.currentTarget.style.color = '#444')}
//             onMouseOut={(e) => (e.currentTarget.style.color = '#888')}
//           >
//             <RxCross2 size={25} />
//           </button>
//         </div>
//         <div style={{ padding: 24 }}>
//           {formError && (
//             <div
//               style={{
//                 background: '#fef2f2',
//                 border: '1px solid #fecaca',
//                 borderRadius: 8,
//                 padding: 16,
//                 display: 'flex',
//                 alignItems: 'center',
//                 marginBottom: 16,
//               }}
//             >
//               <span style={{ color: '#b91c1c' }}>{formError}</span>
//             </div>
//           )}
//           <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
//             <div style={{ flex: '1 1 300px', minWidth: 250, marginBottom: 16 }}>
//               <label
//                 style={{
//                   display: 'block',
//                   fontSize: 14,
//                   fontWeight: 500,
//                   color: '#444',
//                   marginBottom: 8,
//                 }}
//               >
//                 Name *
//               </label>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleInputChange}
//                 required
//                 style={{
//                   width: '100%',
//                   padding: 12,
//                   border: '1px solid #d1d5db',
//                   borderRadius: 8,
//                   fontSize: 15,
//                   marginBottom: 0,
//                 }}
//                 placeholder="Enter full name"
//               />
//             </div>
//             <div style={{ flex: '1 1 300px', minWidth: 250, marginBottom: 16 }}>
//               <label
//                 style={{
//                   display: 'block',
//                   fontSize: 14,
//                   fontWeight: 500,
//                   color: '#444',
//                   marginBottom: 8,
//                 }}
//               >
//                 Email *
//               </label>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleInputChange}
//                 required
//                 style={{
//                   width: '100%',
//                   padding: 12,
//                   border: '1px solid #d1d5db',
//                   borderRadius: 8,
//                   fontSize: 15,
//                   marginBottom: 0,
//                 }}
//                 placeholder="Enter email address"
//               />
//             </div>
//             <div style={{ flex: '1 1 300px', minWidth: 250, marginBottom: 16 }}>
//               <label
//                 style={{
//                   display: 'block',
//                   fontSize: 14,
//                   fontWeight: 500,
//                   color: '#444',
//                   marginBottom: 8,
//                 }}
//               >
//                 Contact Number *
//               </label>
//               <input
//                 type="tel"
//                 name="contactNo"
//                 value={formData.contactNo}
//                 onChange={handleInputChange}
//                 required
//                 style={{
//                   width: '100%',
//                   padding: 12,
//                   border: '1px solid #d1d5db',
//                   borderRadius: 8,
//                   fontSize: 15,
//                   marginBottom: 0,
//                 }}
//                 placeholder="Enter contact number"
//               />
//             </div>
//             <div style={{ flex: '1 1 300px', minWidth: 250, marginBottom: 16 }}>
//               <label
//                 style={{
//                   display: 'block',
//                   fontSize: 14,
//                   fontWeight: 500,
//                   color: '#444',
//                   marginBottom: 8,
//                 }}
//               >
//                 Source *
//               </label>
//               <select
//                 name="source"
//                 value={formData.source}
//                 onChange={handleInputChange}
//                 required
//                 style={{
//                   width: '100%',
//                   padding: 12,
//                   border: '1px solid #d1d5db',
//                   borderRadius: 8,
//                   fontSize: 15,
//                   marginBottom: 0,
//                 }}
//               >
//                 {sourceOptions.map((opt) => (
//                   <option key={opt.id} value={opt.option}>
//                     {opt.option}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div style={{ flex: '1 1 300px', minWidth: 250, marginBottom: 16 }}>
//               <label
//                 style={{
//                   display: 'block',
//                   fontSize: 14,
//                   fontWeight: 500,
//                   color: '#444',
//                   marginBottom: 8,
//                 }}
//               >
//                 Status
//               </label>
//               <select
//                 name="status"
//                 value={formData.status}
//                 onChange={handleInputChange}
//                 style={{
//                   width: '100%',
//                   padding: 12,
//                   border: '1px solid #d1d5db',
//                   borderRadius: 8,
//                   fontSize: 15,
//                   marginBottom: 0,
//                 }}
//               >
//                 {statusOptions.map((opt) => (
//                   <option key={opt.id} value={opt.option}>
//                     {opt.option}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div style={{ flex: '1 1 300px', minWidth: 250, marginBottom: 16 }}>
//               <label
//                 style={{
//                   display: 'block',
//                   fontSize: 14,
//                   fontWeight: 500,
//                   color: '#444',
//                   marginBottom: 8,
//                 }}
//               >
//                 Industry
//               </label>
//               <input
//                 type="text"
//                 name="industry"
//                 value={formData.industry}
//                 onChange={handleInputChange}
//                 style={{
//                   width: '100%',
//                   padding: 12,
//                   border: '1px solid #d1d5db',
//                   borderRadius: 8,
//                   fontSize: 15,
//                   marginBottom: 0,
//                 }}
//                 placeholder="Enter industry"
//               />
//             </div>
//             <div style={{ flex: '1 1 300px', minWidth: 250, marginBottom: 16 }}>
//               <label
//                 style={{
//                   display: 'block',
//                   fontSize: 14,
//                   fontWeight: 500,
//                   color: '#444',
//                   marginBottom: 8,
//                 }}
//               >
//                 Remark
//               </label>
//               <input
//                 type="text"
//                 name="remark"
//                 value={formData.remark}
//                 onChange={handleInputChange}
//                 style={{
//                   width: '100%',
//                   padding: 12,
//                   border: '1px solid #d1d5db',
//                   borderRadius: 8,
//                   fontSize: 15,
//                   marginBottom: 0,
//                 }}
//                 placeholder="Enter remark"
//               />
//             </div>
//             <div style={{ flex: '1 1 300px', minWidth: 250, marginBottom: 16 }}>
//               <label
//                 style={{
//                   display: 'block',
//                   fontSize: 14,
//                   fontWeight: 500,
//                   color: '#444',
//                   marginBottom: 8,
//                 }}
//               >
//                 Notes
//               </label>
//               <input
//                 type="text"
//                 name="notes"
//                 value={formData.notes}
//                 onChange={handleInputChange}
//                 style={{
//                   width: '100%',
//                   padding: 12,
//                   border: '1px solid #d1d5db',
//                   borderRadius: 8,
//                   fontSize: 15,
//                   marginBottom: 0,
//                 }}
//                 placeholder="Enter notes"
//               />
//             </div>
//           </div>
//           <div style={{ marginBottom: 24 }}>
//             <h3 style={{ fontSize: 18, fontWeight: 500, color: '#222', marginBottom: 12 }}>
//               Address Information
//             </h3>
//             <div style={{ marginBottom: 16 }}>
//               <label
//                 style={{
//                   display: 'block',
//                   fontSize: 14,
//                   fontWeight: 500,
//                   color: '#444',
//                   marginBottom: 8,
//                 }}
//               >
//                 Address Detail
//               </label>
//               <input
//                 type="text"
//                 name="Address.detail"
//                 value={formData.Address.detail}
//                 onChange={handleInputChange}
//                 style={{
//                   width: '100%',
//                   padding: 12,
//                   border: '1px solid #d1d5db',
//                   borderRadius: 8,
//                   fontSize: 15,
//                   marginBottom: 0,
//                 }}
//                 placeholder="House no, Street, etc."
//               />
//             </div>
//             <div style={{ display: 'flex', gap: 16 }}>
//               <div style={{ flex: 1, minWidth: 120 }}>
//                 <label
//                   style={{
//                     display: 'block',
//                     fontSize: 14,
//                     fontWeight: 500,
//                     color: '#444',
//                     marginBottom: 8,
//                   }}
//                 >
//                   Pin Code
//                 </label>
//                 <input
//                   type="text"
//                   name="Address.pinCode"
//                   value={formData.Address.pinCode}
//                   onChange={handleInputChange}
//                   style={{
//                     width: '100%',
//                     padding: 12,
//                     border: '1px solid #d1d5db',
//                     borderRadius: 8,
//                     fontSize: 15,
//                     marginBottom: 0,
//                   }}
//                   placeholder="Enter pin code"
//                 />
//               </div>
//               <div style={{ flex: 1, minWidth: 120 }}>
//                 <label
//                   style={{
//                     display: 'block',
//                     fontSize: 14,
//                     fontWeight: 500,
//                     color: '#444',
//                     marginBottom: 8,
//                   }}
//                 >
//                   City
//                 </label>
//                 <input
//                   type="text"
//                   name="Address.city"
//                   value={formData.Address.city}
//                   onChange={handleInputChange}
//                   style={{
//                     width: '100%',
//                     padding: 12,
//                     border: '1px solid #d1d5db',
//                     borderRadius: 8,
//                     fontSize: 15,
//                     marginBottom: 0,
//                   }}
//                   placeholder="Enter city"
//                 />
//               </div>
//               <div style={{ flex: 1, minWidth: 120 }}>
//                 <label
//                   style={{
//                     display: 'block',
//                     fontSize: 14,
//                     fontWeight: 500,
//                     color: '#444',
//                     marginBottom: 8,
//                   }}
//                 >
//                   Country
//                 </label>
//                 <input
//                   type="text"
//                   name="Address.country"
//                   value={formData.Address.country}
//                   onChange={handleInputChange}
//                   style={{
//                     width: '100%',
//                     padding: 12,
//                     border: '1px solid #d1d5db',
//                     borderRadius: 8,
//                     fontSize: 15,
//                     marginBottom: 0,
//                   }}
//                   placeholder="Enter country"
//                 />
//               </div>
//             </div>
//           </div>
//           <div style={{ marginBottom: 24 }}>
//             <label
//               style={{
//                 display: 'block',
//                 fontSize: 14,
//                 fontWeight: 500,
//                 color: '#444',
//                 marginBottom: 8,
//               }}
//             >
//               Documents *
//             </label>
//             <input
//               type="file"
//               name="documents"
//               onChange={handleInputChange}
//               accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
//               required
//               style={{
//                 width: '100%',
//                 padding: 12,
//                 border: '1px solid #d1d5db',
//                 borderRadius: 8,
//                 fontSize: 15,
//                 marginBottom: 0,
//               }}
//             />
//             <p style={{ fontSize: 13, color: '#6b7280', marginTop: 8 }}>
//               Upload PDF, DOC, or image files (Required)
//             </p>
//           </div>
//           <div style={{ display: 'flex', gap: 16, paddingTop: 24, borderTop: '1px solid #e5e7eb' }}>
//             <button
//               type="button"
//               onClick={onClose}
//               style={{
//                 flex: 1,
//                 padding: '12px 24px',
//                 border: '1px solid #d1d5db',
//                 color: '#444',
//                 borderRadius: 8,
//                 background: '#fff',
//                 cursor: 'pointer',
//                 fontWeight: 500,
//                 fontSize: 16,
//                 transition: 'background 0.2s',
//               }}
//               onMouseOver={(e) => (e.currentTarget.style.background = '#f3f4f6')}
//               onMouseOut={(e) => (e.currentTarget.style.background = '#fff')}
//             >
//               Cancel
//             </button>
//             <button
//               type="button"
//               onClick={createLead}
//               disabled={loading}
//               style={{
//                 flex: 1,
//                 padding: '12px 24px',
//                 background: loading ? '#60a5fa' : '#2563eb',
//                 color: '#fff',
//                 borderRadius: 8,
//                 border: 'none',
//                 fontWeight: 600,
//                 fontSize: 16,
//                 marginLeft: 0,
//                 cursor: loading ? 'not-allowed' : 'pointer',
//                 opacity: loading ? 0.7 : 1,
//                 transition: 'background 0.2s',
//               }}
//             >
//               {loading ? 'Creating...' : 'Create Lead'}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateLeadModal;


// import React, { useState, useEffect } from 'react';
// import { RxCross2 } from 'react-icons/rx';

// const statusOptions = [
//   { id: 1, option: 'Not Sure' },
//   { id: 2, option: 'Completed' },
//   { id: 3, option: 'Under Conversation' },
//   { id: 4, option: 'Deal Closed' },
//   { id: 5, option: 'Under Process' },
// ];

// const sourceOptions = [
//   { id: 1, option: 'LinkedIn' },
//   { id: 2, option: 'Facebook' },
//   { id: 3, option: 'Website' },
//   { id: 4, option: 'Referral' },
//   { id: 5, option: 'Other' },
// ];

// const CreateLeadModal = ({ onClose, onCreate }) => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     contactNo: '',
//     source: 'LinkedIn',
//     status: 'Not Sure',
//     remark: '',
//     notes: '',
//     industry: '',
//     Address: { detail: '', pinCode: '', city: '', country: 'India' },
//     documents: null,
//     assignedTo: '',
//   });
//   const [formError, setFormError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [users, setUsers] = useState([]);
//   const [userLoading, setUserLoading] = useState(false);

//   const VITE_FILE_BASE_URL = import.meta.env.VITE_FILE_BASE_URL || 'http://localhost:3000/';
//   const authString = localStorage.getItem('auth');
//   let token = '';
//   if (authString) {
//     try {
//       const auth = JSON.parse(authString);
//       token = auth?.current?.token || '';
//     } catch (error) {
//       console.error('Failed to parse auth from localStorage:', error);
//     }
//   }

//   const fetchUsers = async () => {
//     setUserLoading(true);
//     try {
//       const endpoint = 'get-All';
//       const response = await fetch(`${VITE_FILE_BASE_URL}api/v1/user/${endpoint}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       let result = await response.json();
//       if (result.success) {
//         result = result.admins || [];
//         setUsers(result);
//       } else {
//         console.error('Failed to fetch users:', result.message);
//       }
//     } catch (error) {
//       console.error('Error fetching users:', error);
//     } finally {
//       setUserLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const createLead = async () => {
//     if (
//       !formData.name ||
//       !formData.email ||
//       !formData.contactNo ||
//       !formData.source ||
//       !formData.documents ||
//       !formData.assignedTo
//     ) {
//       setFormError('Name, Email, Contact Number, Source, Documents, and Assigned To are required');
//       return;
//     }

//     setLoading(true);
//     setFormError('');
//     try {
//       const formDataToSend = new FormData();
//       Object.entries(formData).forEach(([key, value]) => {
//         if (key === 'Address') {
//           formDataToSend.append('Address', JSON.stringify(value));
//         } else if (key === 'documents' && value) {
//           formDataToSend.append('documents', value);
//         } else if (value && key !== 'documents') {
//           formDataToSend.append(key, value);
//         }
//       });

//       const response = await fetch(`${VITE_FILE_BASE_URL}api/v1/lead/create`, {
//         method: 'POST',
//         headers: { Authorization: `Bearer ${token}` },
//         body: formDataToSend,
//       });

//       const result = await response.json();
//       if (result.success) {
//         onCreate();
//       } else {
//         setFormError(result.message || 'Failed to create lead');
//       }
//     } catch (error) {
//       console.error('Error creating lead:', error);
//       setFormError('Failed to create lead');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value, files } = e.target;
//     if (name === 'documents') {
//       setFormData((prev) => ({ ...prev, documents: files[0] }));
//     } else if (name.startsWith('Address.')) {
//       const addressField = name.split('.')[1];
//       setFormData((prev) => ({
//         ...prev,
//         Address: { ...prev.Address, [addressField]: value },
//       }));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   return (
//     <div
//       style={{
//         position: 'fixed',
//         top: 0,
//         left: 0,
//         width: '100vw',
//         height: '100vh',
//         background: 'rgba(0,0,0,0.5)',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         padding: 16,
//         zIndex: 9999,
//       }}
//     >
//       <div
//         style={{
//           background: '#fff',
//           borderRadius: 16,
//           maxWidth: 700,
//           width: '100%',
//           maxHeight: '90vh',
//           overflowY: 'auto',
//           boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
//         }}
//       >
//         <div
//           style={{
//             padding: 24,
//             borderBottom: '1px solid #e5e7eb',
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//           }}
//         >
//           <h2 style={{ fontSize: 24, fontWeight: 700, color: '#222' }}>Create New Lead</h2>
//           <button
//             onClick={onClose}
//             style={{
//               padding: 8,
//               color: '#888',
//               background: 'transparent',
//               border: 'none',
//               borderRadius: 8,
//               cursor: 'pointer',
//               transition: 'background 0.2s',
//             }}
//             onMouseOver={(e) => (e.currentTarget.style.color = '#444')}
//             onMouseOut={(e) => (e.currentTarget.style.color = '#888')}
//           >
//             <RxCross2 size={25} />
//           </button>
//         </div>
//         <div style={{ padding: 24 }}>
//           {formError && (
//             <div
//               style={{
//                 background: '#fef2f2',
//                 border: '1px solid #fecaca',
//                 borderRadius: 8,
//                 padding: 16,
//                 display: 'flex',
//                 alignItems: 'center',
//                 marginBottom: 16,
//               }}
//             >
//               <span style={{ color: '#b91c1c' }}>{formError}</span>
//             </div>
//           )}
//           <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
//             <div style={{ flex: '1 1 300px', minWidth: 250, marginBottom: 16 }}>
//               <label
//                 style={{
//                   display: 'block',
//                   fontSize: 14,
//                   fontWeight: 500,
//                   color: '#444',
//                   marginBottom: 8,
//                 }}
//               >
//                 Name *
//               </label>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleInputChange}
//                 required
//                 style={{
//                   width: '100%',
//                   padding: 12,
//                   border: '1px solid #d1d5db',
//                   borderRadius: 8,
//                   fontSize: 15,
//                   marginBottom: 0,
//                 }}
//                 placeholder="Enter full name"
//               />
//             </div>
//             <div style={{ flex: '1 1 300px', minWidth: 250, marginBottom: 16 }}>
//               <label
//                 style={{
//                   display: 'block',
//                   fontSize: 14,
//                   fontWeight: 500,
//                   color: '#444',
//                   marginBottom: 8,
//                 }}
//               >
//                 Email *
//               </label>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleInputChange}
//                 required
//                 style={{
//                   width: '100%',
//                   padding: 12,
//                   border: '1px solid #d1d5db',
//                   borderRadius: 8,
//                   fontSize: 15,
//                   marginBottom: 0,
//                 }}
//                 placeholder="Enter email address"
//               />
//             </div>
//             <div style={{ flex: '1 1 300px', minWidth: 250, marginBottom: 16 }}>
//               <label
//                 style={{
//                   display: 'block',
//                   fontSize: 14,
//                   fontWeight: 500,
//                   color: '#444',
//                   marginBottom: 8,
//                 }}
//               >
//                 Contact Number *
//               </label>
//               <input
//                 type="tel"
//                 name="contactNo"
//                 value={formData.contactNo}
//                 onChange={handleInputChange}
//                 required
//                 style={{
//                   width: '100%',
//                   padding: 12,
//                   border: '1px solid #d1d5db',
//                   borderRadius: 8,
//                   fontSize: 15,
//                   marginBottom: 0,
//                 }}
//                 placeholder="Enter contact number"
//               />
//             </div>
//             <div style={{ flex: '1 1 300px', minWidth: 250, marginBottom: 16 }}>
//               <label
//                 style={{
//                   display: 'block',
//                   fontSize: 14,
//                   fontWeight: 500,
//                   color: '#444',
//                   marginBottom: 8,
//                 }}
//               >
//                 Source *
//               </label>
//               <select
//                 name="source"
//                 value={formData.source}
//                 onChange={handleInputChange}
//                 required
//                 style={{
//                   width: '100%',
//                   padding: 12,
//                   border: '1px solid #d1d5db',
//                   borderRadius: 8,
//                   fontSize: 15,
//                   marginBottom: 0,
//                 }}
//               >
//                 {sourceOptions.map((opt) => (
//                   <option key={opt.id} value={opt.option}>
//                     {opt.option}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div style={{ flex: '1 1 300px', minWidth: 250, marginBottom: 16 }}>
//               <label
//                 style={{
//                   display: 'block',
//                   fontSize: 14,
//                   fontWeight: 500,
//                   color: '#444',
//                   marginBottom: 8,
//                 }}
//               >
//                 Assigned To *
//               </label>
//               <select
//                 name="assignedTo"
//                 value={formData.assignedTo}
//                 onChange={handleInputChange}
//                 required
//                 disabled={userLoading}
//                 style={{
//                   width: '100%',
//                   padding: 12,
//                   border: '1px solid #d1d5db',
//                   borderRadius: 8,
//                   fontSize: 15,
//                   marginBottom: 0,
//                   background: userLoading ? '#f3f4f6' : '#fff',
//                   cursor: userLoading ? 'not-allowed' : 'pointer',
//                 }}
//               >
//                 <option value="">Select a user</option>
//                 {users.map((user) => (
//                   <option key={user.id} value={user.id}>
//                     {user.name} ({user.email})
//                   </option>
//                 ))}
//               </select>
//               {userLoading && (
//                 <p style={{ fontSize: 13, color: '#6b7280', marginTop: 8 }}>
//                   Loading users...
//                 </p>
//               )}
//             </div>
//             <div style={{ flex: '1 1 300px', minWidth: 250, marginBottom: 16 }}>
//               <label
//                 style={{
//                   display: 'block',
//                   fontSize: 14,
//                   fontWeight: 500,
//                   color: '#444',
//                   marginBottom: 8,
//                 }}
//               >
//                 Status
//               </label>
//               <select
//                 name="status"
//                 value={formData.status}
//                 onChange={handleInputChange}
//                 style={{
//                   width: '100%',
//                   padding: 12,
//                   border: '1px solid #d1d5db',
//                   borderRadius: 8,
//                   fontSize: 15,
//                   marginBottom: 0,
//                 }}
//               >
//                 {statusOptions.map((opt) => (
//                   <option key={opt.id} value={opt.option}>
//                     {opt.option}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div style={{ flex: '1 1 300px', minWidth: 250, marginBottom: 16 }}>
//               <label
//                 style={{
//                   display: 'block',
//                   fontSize: 14,
//                   fontWeight: 500,
//                   color: '#444',
//                   marginBottom: 8,
//                 }}
//               >
//                 Industry
//               </label>
//               <input
//                 type="text"
//                 name="industry"
//                 value={formData.industry}
//                 onChange={handleInputChange}
//                 style={{
//                   width: '100%',
//                   padding: 12,
//                   border: '1px solid #d1d5db',
//                   borderRadius: 8,
//                   fontSize: 15,
//                   marginBottom: 0,
//                 }}
//                 placeholder="Enter industry"
//               />
//             </div>
//             <div style={{ flex: '1 1 300px', minWidth: 250, marginBottom: 16 }}>
//               <label
//                 style={{
//                   display: 'block',
//                   fontSize: 14,
//                   fontWeight: 500,
//                   color: '#444',
//                   marginBottom: 8,
//                 }}
//               >
//                 Remark
//               </label>
//               <input
//                 type="text"
//                 name="remark"
//                 value={formData.remark}
//                 onChange={handleInputChange}
//                 style={{
//                   width: '100%',
//                   padding: 12,
//                   border: '1px solid #d1d5db',
//                   borderRadius: 8,
//                   fontSize: 15,
//                   marginBottom: 0,
//                 }}
//                 placeholder="Enter remark"
//               />
//             </div>
//             <div style={{ flex: '1 1 300px', minWidth: 250, marginBottom: 16 }}>
//               <label
//                 style={{
//                   display: 'block',
//                   fontSize: 14,
//                   fontWeight: 500,
//                   color: '#444',
//                   marginBottom: 8,
//                 }}
//               >
//                 Notes
//               </label>
//               <input
//                 type="text"
//                 name="notes"
//                 value={formData.notes}
//                 onChange={handleInputChange}
//                 style={{
//                   width: '100%',
//                   padding: 12,
//                   border: '1px solid #d1d5db',
//                   borderRadius: 8,
//                   fontSize: 15,
//                   marginBottom: 0,
//                 }}
//                 placeholder="Enter notes"
//               />
//             </div>
//           </div>
//           <div style={{ marginBottom: 24 }}>
//             <h3 style={{ fontSize: 18, fontWeight: 500, color: '#222', marginBottom: 12 }}>
//               Address Information
//             </h3>
//             <div style={{ marginBottom: 16 }}>
//               <label
//                 style={{
//                   display: 'block',
//                   fontSize: 14,
//                   fontWeight: 500,
//                   color: '#444',
//                   marginBottom: 8,
//                 }}
//               >
//                 Address Detail
//               </label>
//               <input
//                 type="text"
//                 name="Address.detail"
//                 value={formData.Address.detail}
//                 onChange={handleInputChange}
//                 style={{
//                   width: '100%',
//                   padding: 12,
//                   border: '1px solid #d1d5db',
//                   borderRadius: 8,
//                   fontSize: 15,
//                   marginBottom: 0,
//                 }}
//                 placeholder="House no, Street, etc."
//               />
//             </div>
//             <div style={{ display: 'flex', gap: 16 }}>
//               <div style={{ flex: 1, minWidth: 120 }}>
//                 <label
//                   style={{
//                     display: 'block',
//                     fontSize: 14,
//                     fontWeight: 500,
//                     color: '#444',
//                     marginBottom: 8,
//                   }}
//                 >
//                   Pin Code
//                 </label>
//                 <input
//                   type="text"
//                   name="Address.pinCode"
//                   value={formData.Address.pinCode}
//                   onChange={handleInputChange}
//                   style={{
//                     width: '100%',
//                     padding: 12,
//                     border: '1px solid #d1d5db',
//                     borderRadius: 8,
//                     fontSize: 15,
//                     marginBottom: 0,
//                   }}
//                   placeholder="Enter pin code"
//                 />
//               </div>
//               <div style={{ flex: 1, minWidth: 120 }}>
//                 <label
//                   style={{
//                     display: 'block',
//                     fontSize: 14,
//                     fontWeight: 500,
//                     color: '#444',
//                     marginBottom: 8,
//                   }}
//                 >
//                   City
//                 </label>
//                 <input
//                   type="text"
//                   name="Address.city"
//                   value={formData.Address.city}
//                   onChange={handleInputChange}
//                   style={{
//                     width: '100%',
//                     padding: 12,
//                     border: '1px solid #d1d5db',
//                     borderRadius: 8,
//                     fontSize: 15,
//                     marginBottom: 0,
//                   }}
//                   placeholder="Enter city"
//                 />
//               </div>
//               <div style={{ flex: 1, minWidth: 120 }}>
//                 <label
//                   style={{
//                     display: 'block',
//                     fontSize: 14,
//                     fontWeight: 500,
//                     color: '#444',
//                     marginBottom: 8,
//                   }}
//                 >
//                   Country
//                 </label>
//                 <input
//                   type="text"
//                   name="Address.country"
//                   value={formData.Address.country}
//                   onChange={handleInputChange}
//                   style={{
//                     width: '100%',
//                     padding: 12,
//                     border: '1px solid #d1d5db',
//                     borderRadius: 8,
//                     fontSize: 15,
//                     marginBottom: 0,
//                   }}
//                   placeholder="Enter country"
//                 />
//               </div>
//             </div>
//           </div>
//           <div style={{ marginBottom: 24 }}>
//             <label
//               style={{
//                 display: 'block',
//                 fontSize: 14,
//                 fontWeight: 500,
//                 color: '#444',
//                 marginBottom: 8,
//               }}
//             >
//               Documents *
//             </label>
//             <input
//               type="file"
//               name="documents"
//               onChange={handleInputChange}
//               accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
//               required
//               style={{
//                 width: '100%',
//                 padding: 12,
//                 border: '1px solid #d1d5db',
//                 borderRadius: 8,
//                 fontSize: 15,
//                 marginBottom: 0,
//               }}
//             />
//             <p style={{ fontSize: 13, color: '#6b7280', marginTop: 8 }}>
//               Upload PDF, DOC, or image files (Required)
//             </p>
//           </div>
//           <div style={{ display: 'flex', gap: 16, paddingTop: 24, borderTop: '1px solid #e5e7eb' }}>
//             <button
//               type="button"
//               onClick={onClose}
//               style={{
//                 flex: 1,
//                 padding: '12px 24px',
//                 border: '1px solid #d1d5db',
//                 color: '#444',
//                 borderRadius: 8,
//                 background: '#fff',
//                 cursor: 'pointer',
//                 fontWeight: 500,
//                 fontSize: 16,
//                 transition: 'background 0.2s',
//               }}
//               onMouseOver={(e) => (e.currentTarget.style.background = '#f3f4f6')}
//               onMouseOut={(e) => (e.currentTarget.style.background = '#fff')}
//             >
//               Cancel
//             </button>
//             <button
//               type="button"
//               onClick={createLead}
//               disabled={loading}
//               style={{
//                 flex: 1,
//                 padding: '12px 24px',
//                 background: loading ? '#60a5fa' : '#2563eb',
//                 color: '#fff',
//                 borderRadius: 8,
//                 border: 'none',
//                 fontWeight: 600,
//                 fontSize: 16,
//                 marginLeft: 0,
//                 cursor: loading ? 'not-allowed' : 'pointer',
//                 opacity: loading ? 0.7 : 1,
//                 transition: 'background 0.2s',
//               }}
//             >
//               {loading ? 'Creating...' : 'Create Lead'}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateLeadModal;

import React, { useState, useEffect } from 'react';
import { RxCross2 } from 'react-icons/rx';

const statusOptions = [
  { id: 1, option: 'Not Sure' },
  { id: 2, option: 'Completed' },
  { id: 3, option: 'Under Conversation' },
  { id: 4, option: 'Deal Closed' },
  { id: 5, option: 'Under Process' },
];

const sourceOptions = [
  { id: 1, option: 'LinkedIn' },
  { id: 2, option: 'Facebook' },
  { id: 3, option: 'Website' },
  { id: 4, option: 'Referral' },
  { id: 5, option: 'Other' },
];

const CreateLeadModal = ({ onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNo: '',
    source: 'LinkedIn',
    status: 'Not Sure',
    remark: '',
    notes: '',
    industry: '',
    Address: { detail: '', pinCode: '', city: '', country: 'India' },
    documents: null,
    assignedTo: '',
  });
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [userLoading, setUserLoading] = useState(false);

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

  const fetchUsers = async () => {
    setUserLoading(true);
    try {
      const endpoint = 'get-All';
      const response = await fetch(`${VITE_FILE_BASE_URL}api/v1/user/${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (result.success) {
        setUsers(result.admins || []);
      } else {
        console.error('Failed to fetch users:', result.message);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setUserLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const createLead = async () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.contactNo ||
      !formData.source ||
      !formData.documents ||
      !formData.assignedTo
    ) {
      setFormError('Name, Email, Contact Number, Source, Documents, and Assigned To are required');
      return;
    }

    setLoading(true);
    setFormError('');
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'Address') {
          formDataToSend.append('Address', JSON.stringify(value));
        } else if (key === 'documents' && value) {
          formDataToSend.append('documents', value);
        } else if (value && key !== 'documents') {
          formDataToSend.append(key, value);
        }
      });

      const response = await fetch(`${VITE_FILE_BASE_URL}api/v1/lead/create`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formDataToSend,
      });

      const result = await response.json();
      if (result.success) {
        onCreate();
      } else {
        setFormError(result.message || 'Failed to create lead');
      }
    } catch (error) {
      console.error('Error creating lead:', error);
      setFormError('Failed to create lead');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'documents') {
      setFormData((prev) => ({ ...prev, documents: files[0] }));
    } else if (name.startsWith('Address.')) {
      const addressField = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        Address: { ...prev.Address, [addressField]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          maxWidth: 700,
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
        }}
      >
        <div
          style={{
            padding: 24,
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#222' }}>Create New Lead</h2>
          <button
            onClick={onClose}
            style={{
              padding: 8,
              color: '#888',
              background: 'transparent',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = '#444')}
            onMouseOut={(e) => (e.currentTarget.style.color = '#888')}
          >
            <RxCross2 size={25} />
          </button>
        </div>
        <div style={{ padding: 24 }}>
          {formError && (
            <div
              style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: 8,
                padding: 16,
                display: 'flex',
                alignItems: 'center',
                marginBottom: 16,
              }}
            >
              <span style={{ color: '#b91c1c' }}>{formError}</span>
            </div>
          )}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
            <div style={{ flex: '1 1 300px', minWidth: 250, marginBottom: 16 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 14,
                  fontWeight: 500,
                  color: '#444',
                  marginBottom: 8,
                }}
              >
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: 12,
                  border: '1px solid #d1d5db',
                  borderRadius: 8,
                  fontSize: 15,
                  marginBottom: 0,
                }}
                placeholder="Enter full name"
              />
            </div>
            <div style={{ flex: '1 1 300px', minWidth: 250, marginBottom: 16 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 14,
                  fontWeight: 500,
                  color: '#444',
                  marginBottom: 8,
                }}
              >
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: 12,
                  border: '1px solid #d1d5db',
                  borderRadius: 8,
                  fontSize: 15,
                  marginBottom: 0,
                }}
                placeholder="Enter email address"
              />
            </div>
            <div style={{ flex: '1 1 300px', minWidth: 250, marginBottom: 16 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 14,
                  fontWeight: 500,
                  color: '#444',
                  marginBottom: 8,
                }}
              >
                Contact Number *
              </label>
              <input
                type="tel"
                name="contactNo"
                value={formData.contactNo}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: 12,
                  border: '1px solid #d1d5db',
                  borderRadius: 8,
                  fontSize: 15,
                  marginBottom: 0,
                }}
                placeholder="Enter contact number"
              />
            </div>
            <div style={{ flex: '1 1 300px', minWidth: 250, marginBottom: 16 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 14,
                  fontWeight: 500,
                  color: '#444',
                  marginBottom: 8,
                }}
              >
                Source *
              </label>
              <select
                name="source"
                value={formData.source}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: 12,
                  border: '1px solid #d1d5db',
                  borderRadius: 8,
                  fontSize: 15,
                  marginBottom: 0,
                }}
              >
                {sourceOptions.map((opt) => (
                  <option key={opt.id} value={opt.option}>
                    {opt.option}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ flex: '1 1 300px', minWidth: 250, marginBottom: 16 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 14,
                  fontWeight: 500,
                  color: '#444',
                  marginBottom: 8,
                }}
              >
                Assigned To *
              </label>
              <select
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleInputChange}
                required
                disabled={userLoading}
                style={{
                  width: '100%',
                  padding: 12,
                  border: '1px solid #d1d5db',
                  borderRadius: 8,
                  fontSize: 15,
                  marginBottom: 0,
                  background: userLoading ? '#f3f4f6' : '#fff',
                  cursor: userLoading ? 'not-allowed' : 'pointer',
                }}
              >
                <option value="">Select a user</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
              {userLoading && (
                <p style={{ fontSize: 13, color: '#6b7280', marginTop: 8 }}>
                  Loading users...
                </p>
              )}
            </div>
            <div style={{ flex: '1 1 300px', minWidth: 250, marginBottom: 16 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 14,
                  fontWeight: 500,
                  color: '#444',
                  marginBottom: 8,
                }}
              >
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: 12,
                  border: '1px solid #d1d5db',
                  borderRadius: 8,
                  fontSize: 15,
                  marginBottom: 0,
                }}
              >
                {statusOptions.map((opt) => (
                  <option key={opt.id} value={opt.option}>
                    {opt.option}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ flex: '1 1 300px', minWidth: 250, marginBottom: 16 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 14,
                  fontWeight: 500,
                  color: '#444',
                  marginBottom: 8,
                }}
              >
                Industry
              </label>
              <input
                type="text"
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: 12,
                  border: '1px solid #d1d5db',
                  borderRadius: 8,
                  fontSize: 15,
                  marginBottom: 0,
                }}
                placeholder="Enter industry"
              />
            </div>
            <div style={{ flex: '1 1 300px', minWidth: 250, marginBottom: 16 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 14,
                  fontWeight: 500,
                  color: '#444',
                  marginBottom: 8,
                }}
              >
                Remark
              </label>
              <input
                type="text"
                name="remark"
                value={formData.remark}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: 12,
                  border: '1px solid #d1d5db',
                  borderRadius: 8,
                  fontSize: 15,
                  marginBottom: 0,
                }}
                placeholder="Enter remark"
              />
            </div>
            <div style={{ flex: '1 1 300px', minWidth: 250, marginBottom: 16 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 14,
                  fontWeight: 500,
                  color: '#444',
                  marginBottom: 8,
                }}
              >
                Notes
              </label>
              <input
                type="text"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: 12,
                  border: '1px solid #d1d5db',
                  borderRadius: 8,
                  fontSize: 15,
                  marginBottom: 0,
                }}
                placeholder="Enter notes"
              />
            </div>
          </div>
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 500, color: '#222', marginBottom: 12 }}>
              Address Information
            </h3>
            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 14,
                  fontWeight: 500,
                  color: '#444',
                  marginBottom: 8,
                }}
              >
                Address Detail
              </label>
              <input
                type="text"
                name="Address.detail"
                value={formData.Address.detail}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: 12,
                  border: '1px solid #d1d5db',
                  borderRadius: 8,
                  fontSize: 15,
                  marginBottom: 0,
                }}
                placeholder="House no, Street, etc."
              />
            </div>
            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{ flex: 1, minWidth: 120 }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: 14,
                    fontWeight: 500,
                    color: '#444',
                    marginBottom: 8,
                  }}
                >
                  Pin Code
                </label>
                <input
                  type="text"
                  name="Address.pinCode"
                  value={formData.Address.pinCode}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: 12,
                    border: '1px solid #d1d5db',
                    borderRadius: 8,
                    fontSize: 15,
                    marginBottom: 0,
                  }}
                  placeholder="Enter pin code"
                />
              </div>
              <div style={{ flex: 1, minWidth: 120 }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: 14,
                    fontWeight: 500,
                    color: '#444',
                    marginBottom: 8,
                  }}
                >
                  City
                </label>
                <input
                  type="text"
                  name="Address.city"
                  value={formData.Address.city}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: 12,
                    border: '1px solid #d1d5db',
                    borderRadius: 8,
                    fontSize: 15,
                    marginBottom: 0,
                  }}
                  placeholder="Enter city"
                />
              </div>
              <div style={{ flex: 1, minWidth: 120 }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: 14,
                    fontWeight: 500,
                    color: '#444',
                    marginBottom: 8,
                  }}
                >
                  Country
                </label>
                <input
                  type="text"
                  name="Address.country"
                  value={formData.Address.country}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: 12,
                    border: '1px solid #d1d5db',
                    borderRadius: 8,
                    fontSize: 15,
                    marginBottom: 0,
                  }}
                  placeholder="Enter country"
                />
              </div>
            </div>
          </div>
          <div style={{ marginBottom: 24 }}>
            <label
              style={{
                display: 'block',
                fontSize: 14,
                fontWeight: 500,
                color: '#444',
                marginBottom: 8,
              }}
            >
              Documents *
            </label>
            <input
              type="file"
              name="documents"
              onChange={handleInputChange}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              required
              style={{
                width: '100%',
                padding: 12,
                border: '1px solid #d1d5db',
                borderRadius: 8,
                fontSize: 15,
                marginBottom: 0,
              }}
            />
            <p style={{ fontSize: 13, color: '#6b7280', marginTop: 8 }}>
              Upload PDF, DOC, or image files (Required)
            </p>
          </div>
          <div style={{ display: 'flex', gap: 16, paddingTop: 24, borderTop: '1px solid #e5e7eb' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '12px 24px',
                border: '1px solid #d1d5db',
                color: '#444',
                borderRadius: 8,
                background: '#fff',
                cursor: 'pointer',
                fontWeight: 500,
                fontSize: 16,
                transition: 'background 0.2s',
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = '#f3f4f6')}
              onMouseOut={(e) => (e.currentTarget.style.background = '#fff')}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={createLead}
              disabled={loading}
              style={{
                flex: 1,
                padding: '12px 24px',
                background: loading ? '#60a5fa' : '#2563eb',
                color: '#fff',
                borderRadius: 8,
                border: 'none',
                fontWeight: 600,
                fontSize: 16,
                marginLeft: 0,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                transition: 'background 0.2s',
              }}
            >
              {loading ? 'Creating...' : 'Create Lead'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateLeadModal;