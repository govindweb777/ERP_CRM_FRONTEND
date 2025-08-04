// import { Space, Layout, Divider, Typography } from 'antd';
// import logo from '@/style/images/weblogo.png';
// import useLanguage from '@/locale/useLanguage';
// import { useSelector } from 'react-redux';

// const { Content } = Layout;
// const { Title, Text } = Typography;

// export default function SideContent() {
//   const translate = useLanguage();

//   return (
//     <Content
//       style={{
//         padding: '150px 30px 30px',
//         width: '100%',
//         maxWidth: '450px',
//         margin: '0 auto',
//       }}
//       className="sideContent"
//     >
//       <div style={{ width: '100%' , fontSize: 28}}>

//         <div className="flex flex-row items-center gap-4">
//           <img
//             src={logo}
//             alt="IDURAR ERP CRM"
//             height={63}
//             width={100}
//             className="block"
//           />
//           <div className="text-2xl font-semibold">
//             WebSeeder Technology
//           </div>
//         </div>

//         <Title level={1} style={{ fontSize: 28 }}>
//           Free Open Source ERP / CRM
//         </Title>
//         <Text>
//           Accounting / Invoicing / Quote App <b /> based on Node.js React.js Ant Design
//         </Text>

//         <div className="space20"></div>
//       </div>
//     </Content>
//   );
// }


import { Space, Layout, Divider, Typography } from 'antd';
import logo from '@/style/images/weblogo.png';
import useLanguage from '@/locale/useLanguage';
import { useSelector } from 'react-redux';

const { Content } = Layout;
const { Title, Text } = Typography;

export default function SideContent() {
  const translate = useLanguage();

  return (
    <Content
      style={{
        padding: '150px 30px 30px',
        width: '100%',
        maxWidth: '450px',
        margin: '0 auto',
      }}
      className="sideContent"
    >
      <div style={{ width: '100%', fontSize: 28 }}>
        
        {/* Flex row replaced with inline style */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '1rem', // approx. Tailwind's gap-4
          }}
        >
          <img
            src={logo}
            alt="IDURAR ERP CRM"
            height={63}
            width={100}
            style={{ display: 'block' }}
          />
          <div className='text-2xl font-semibold'>
           WebSeeder Technologies
          </div>
        </div>

        <Title level={1} style={{ fontSize: 28 }}>
          Free Open Source ERP / CRM
        </Title>
        <Text>
          Accounting / Invoicing / Quote App <b /> based on Node.js React.js Ant Design
        </Text>

        <div className="space20"></div>
      </div>
    </Content>
  );
}
