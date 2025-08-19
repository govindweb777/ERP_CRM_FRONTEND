// import { useState, useEffect } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { Button, Drawer, Layout, Menu } from 'antd';

// import { useAppContext } from '@/context/appContext';

// import useLanguage from '@/locale/useLanguage';
// import logoIcon from '@/style/images/weblogo.png';
// import logoText from '@/style/images/logo-text.svg';

// import useResponsive from '@/hooks/useResponsive';

// import {
//   SettingOutlined,
//   CustomerServiceOutlined,
//   ContainerOutlined,
//   FileSyncOutlined,
//   DashboardOutlined,
//   TagOutlined,
//   TagsOutlined,
//   UserOutlined,
//   CreditCardOutlined,
//   MenuOutlined,
//   FileOutlined,
//   ShopOutlined,
//   FilterOutlined,
//   WalletOutlined,
//   ReconciliationOutlined,
//   ContactsOutlined,
// } from '@ant-design/icons';

// const { Sider } = Layout;

// export default function Navigation() {
//   const { isMobile } = useResponsive();

//   return isMobile ? <MobileSidebar /> : <Sidebar collapsible={false} />;
// }

// function Sidebar({ collapsible, isMobile = false }) {
//   let location = useLocation();

//   const { state: stateApp, appContextAction } = useAppContext();
//   const { isNavMenuClose } = stateApp;
//   const { navMenu } = appContextAction;
//   const [showLogoApp, setLogoApp] = useState(isNavMenuClose);
//   const [currentPath, setCurrentPath] = useState(location.pathname.slice(1));

//   const translate = useLanguage();
//   const navigate = useNavigate();

//   const items = [
//     {
//       key: 'dashboard',
//       icon: <DashboardOutlined />,
//       label: <Link to={'/'}>{translate('dashboard')}</Link>,
//     },
//     {
//       key: 'leads',
//       icon: <ContactsOutlined />,
//       label: <Link to={'/leads'}>{translate('leads')}</Link>,
//     },
//     {
//       key: 'user',
//       icon: <UserOutlined />,
//       label: <Link to={'/user'}>{translate('user')}</Link>,
//     },
//     {
//       key: 'customer',
//       icon: <CustomerServiceOutlined />,
//       label: <Link to={'/customer'}>{translate('customers')}</Link>,
//     },

//     {
//       key: 'invoice',
//       icon: <ContainerOutlined />,
//       label: <Link to={'/invoice'}>{translate('invoices')}</Link>,
//     },
//     {
//       key: 'quote',
//       icon: <FileSyncOutlined />,
//       label: <Link to={'/quote'}>{translate('quote')}</Link>,
//     },
//     {
//       key: 'payment',
//       icon: <CreditCardOutlined />,
//       label: <Link to={'/payment'}>{translate('payments')}</Link>,
//     },

//     {
//       key: 'paymentMode',
//       label: <Link to={'/payment/mode'}>{translate('payments_mode')}</Link>,
//       icon: <WalletOutlined />,
//     },
//     {
//       key: 'taxes',
//       label: <Link to={'/taxes'}>{translate('taxes')}</Link>,
//       icon: <ShopOutlined />,
//     },
//     {
//       key: 'generalSettings',
//       label: <Link to={'/settings'}>{translate('settings')}</Link>,
//       icon: <SettingOutlined />,
//     },
//     {
//       key: 'about',
//       label: <Link to={'/about'}>{translate('about')}</Link>,
//       icon: <ReconciliationOutlined />,
//     },
//      {
//       key: 'follow-up',
//       label: <Link to={'/follow-up'}>{translate('follow-up')}</Link>,
//       icon: <ReconciliationOutlined />,
//     },
//   ];

//   useEffect(() => {
//     if (location)
//       if (currentPath !== location.pathname) {
//         if (location.pathname === '/') {
//           setCurrentPath('dashboard');
//         } else setCurrentPath(location.pathname.slice(1));
//       }
//   }, [location, currentPath]);

//   useEffect(() => {
//     if (isNavMenuClose) {
//       setLogoApp(isNavMenuClose);
//     }
//     const timer = setTimeout(() => {
//       if (!isNavMenuClose) {
//         setLogoApp(isNavMenuClose);
//       }
//     }, 200);
//     return () => clearTimeout(timer);
//   }, [isNavMenuClose]);
//   const onCollapse = () => {
//     navMenu.collapse();
//   };

//   return (
//     <Sider
//       collapsible={collapsible}
//       collapsed={collapsible ? isNavMenuClose : collapsible}
//       onCollapse={onCollapse}
//       className="navigation"
//       width={256}
//       style={{
//         overflow: 'auto',
//         height: '100vh',

//         position: isMobile ? 'absolute' : 'relative',
//         bottom: '20px',
//         ...(!isMobile && {
//           // border: 'none',
//           ['left']: '20px',
//           top: '20px',
//           // borderRadius: '8px',
//         }),
//       }}
//       theme={'light'}
//     >
//       <div
//         className="logo"
//         onClick={() => navigate('/')}
//         style={{
//           cursor: 'pointer',
//         }}
//       >
//         <img src={logoIcon} alt="Logo" style={{ marginLeft: '-5px', height: '40px' }} />

//         {!showLogoApp && (
//           <div style={{ marginLeft: '10px', }}>
//             WebSeeder Technologies
//             </div>
//         )}
//       </div>
//       <Menu
//         items={items}
//         mode="inline"
//         theme={'light'}
//         selectedKeys={[currentPath]}
//         style={{
//           width: 256,
//         }}
//       />
//     </Sider>
//   );
// }

// function MobileSidebar() {
//   const [visible, setVisible] = useState(false);
//   const showDrawer = () => {
//     setVisible(true);
//   };
//   const onClose = () => {
//     setVisible(false);
//   };

//   return (
//     <>
//       <Button
//         type="text"
//         size="large"
//         onClick={showDrawer}
//         className="mobile-sidebar-btn"
//         style={{ ['marginLeft']: 25 }}
//       >
//         <MenuOutlined style={{ fontSize: 18 }} />
//       </Button>
//       <Drawer
//         width={250}
//         // style={{ backgroundColor: 'rgba(255, 255, 255, 1)' }}
//         placement={'left'}
//         closable={false}
//         onClose={onClose}
//         open={visible}
//       >
//         <Sidebar collapsible={false} isMobile={true} />
//       </Drawer>
//     </>
//   );
// }

import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Drawer, Layout, Menu } from 'antd';

import { useAppContext } from '@/context/appContext';

import useLanguage from '@/locale/useLanguage';
import logoIcon from '@/style/images/weblogo.png';
import logoText from '@/style/images/logo-text.svg';

import useResponsive from '@/hooks/useResponsive';

import {
  SettingOutlined,
  CustomerServiceOutlined,
  ContainerOutlined,
  FileSyncOutlined,
  DashboardOutlined,
  TagOutlined,
  TagsOutlined,
  UserOutlined,
  CreditCardOutlined,
  MenuOutlined,
  FileOutlined,
  ShopOutlined,
  FilterOutlined,
  WalletOutlined,
  ReconciliationOutlined,
  ContactsOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

export default function Navigation() {
  const { isMobile } = useResponsive();

  return isMobile ? <MobileSidebar /> : <Sidebar collapsible={false} />;
}

function Sidebar({ collapsible, isMobile = false }) {
  let location = useLocation();

  const { state: stateApp, appContextAction } = useAppContext();
  const { isNavMenuClose } = stateApp;
  const { navMenu } = appContextAction;
  const [showLogoApp, setLogoApp] = useState(isNavMenuClose);
  const [currentPath, setCurrentPath] = useState(location.pathname.slice(1));
  const [userRole, setUserRole] = useState('');

  const translate = useLanguage();
  const navigate = useNavigate();

  // Get user role from localStorage
  useEffect(() => {
    try {
      const authData = localStorage.getItem("auth");
      if (authData) {
        const parsedAuth = JSON.parse(authData);
        const role = parsedAuth?.current?.role || '';
        setUserRole(role.toLowerCase());
      }
    } catch (error) {
      console.error('Error parsing auth data from localStorage:', error);
      setUserRole('');
    }
  }, []);

  // All menu items
  const allItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: <Link to={'/dashboard'}>{translate('dashboard')}</Link>,
    },
    {
      key: 'leads',
      icon: <ContactsOutlined />,
      label: <Link to={'/leads'}>{translate('leads')}</Link>,
    },
    {
      key: 'user',
      icon: <UserOutlined />,
      label: <Link to={'/user'}>{translate('user')}</Link>,
    },
    {
      key: 'customer',
      icon: <CustomerServiceOutlined />,
      label: <Link to={'/customer'}>{translate('customers')}</Link>,
    },
    {
      key: 'invoice',
      icon: <ContainerOutlined />,
      label: <Link to={'/invoice'}>{translate('invoices')}</Link>,
    },
    {
      key: 'quote',
      icon: <FileSyncOutlined />,
      label: <Link to={'/quote'}>{translate('quote')}</Link>,
    },
    {
      key: 'payment',
      icon: <CreditCardOutlined />,
      label: <Link to={'/payment'}>{translate('payments')}</Link>,
    },
    {
      key: 'paymentMode',
      label: <Link to={'/payment/mode'}>{translate('payments_mode')}</Link>,
      icon: <WalletOutlined />,
    },
    {
      key: 'taxes',
      label: <Link to={'/taxes'}>{translate('taxes')}</Link>,
      icon: <ShopOutlined />,
    },
    {
      key: 'generalSettings',
      label: <Link to={'/settings'}>{translate('settings')}</Link>,
      icon: <SettingOutlined />,
    },
    {
      key: 'about',
      label: <Link to={'/about'}>{translate('about')}</Link>,
      icon: <ReconciliationOutlined />,
    },
  ];

  // Follow-up item (only for users)
  const followUpItem = {
    key: 'follow-up',
    label: <Link to={'/follow-up'}>{translate('follow-up')}</Link>,
    icon: <ReconciliationOutlined />,
  };

  // Filter items based on role
  const getMenuItems = () => {
    if (userRole === 'user') {
      // For user role: show only follow-up
      return [followUpItem];
    } else if (userRole === 'admin' || userRole === 'owner') {
      // For admin/owner roles: show all items except follow-up
      return allItems;
    } else {
      // Default fallback: show all items including follow-up
      return [...allItems, followUpItem];
    }
  };

  const items = getMenuItems();

  useEffect(() => {
    if (location)
      if (currentPath !== location.pathname) {
        if (location.pathname === '/') {
          setCurrentPath('dashboard');
        } else setCurrentPath(location.pathname.slice(1));
      }
  }, [location, currentPath]);

  useEffect(() => {
    if (isNavMenuClose) {
      setLogoApp(isNavMenuClose);
    }
    const timer = setTimeout(() => {
      if (!isNavMenuClose) {
        setLogoApp(isNavMenuClose);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [isNavMenuClose]);

  const onCollapse = () => {
    navMenu.collapse();
  };

  return (
    <Sider
      collapsible={collapsible}
      collapsed={collapsible ? isNavMenuClose : collapsible}
      onCollapse={onCollapse}
      className="navigation"
      width={256}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: isMobile ? 'absolute' : 'relative',
        bottom: '20px',
        ...(!isMobile && {
          ['left']: '20px',
          top: '20px',
        }),
      }}
      theme={'light'}
    >
      <div
        className="logo"
        onClick={() => navigate('/')}
        style={{
          cursor: 'pointer',
        }}
      >
        <img src={logoIcon} alt="Logo" style={{ marginLeft: '-5px', height: '40px' }} />

        {!showLogoApp && (
          <div style={{ marginLeft: '10px' }}>
            WebSeeder Technologies
          </div>
        )}
      </div>
      
      {/* Debug info - remove this in production */}
      {/* {process.env.NODE_ENV === 'development' && (
        <div style={{ padding: '10px', fontSize: '12px', color: '#666' }}>
          Current Role: {userRole || 'Not found'}
        </div>
      )} */}
      
      <Menu
        items={items}
        mode="inline"
        theme={'light'}
        selectedKeys={[currentPath]}
        style={{
          width: 256,
        }}
      />
    </Sider>
  );
}

function MobileSidebar() {
  const [visible, setVisible] = useState(false);
  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };

  return (
    <>
      <Button
        type="text"
        size="large"
        onClick={showDrawer}
        className="mobile-sidebar-btn"
        style={{ ['marginLeft']: 25 }}
      >
        <MenuOutlined style={{ fontSize: 18 }} />
      </Button>
      <Drawer
        width={250}
        placement={'left'}
        closable={false}
        onClose={onClose}
        open={visible}
      >
        <Sidebar collapsible={false} isMobile={true} />
      </Drawer>
    </>
  );
}