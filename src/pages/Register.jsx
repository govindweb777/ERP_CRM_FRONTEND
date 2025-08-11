// import { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';

// import useLanguage from '@/locale/useLanguage';

// import { Form, Button } from 'antd';

// import { register } from '@/redux/auth/actions';
// import { selectAuth } from '@/redux/auth/selectors';
// import RegisterForm from '@/forms/RegisterForm';
// import Loading from '@/components/Loading';
// import AuthModule from '@/modules/AuthModule';

// const RegisterPage = () => {
//   const translate = useLanguage();
//   const { isLoading, isSuccess } = useSelector(selectAuth);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const onFinish = (values) => {
//     dispatch(register({ registerData: values }));
//   };

//   useEffect(() => {
//     if (isSuccess) navigate('/');
//   }, [isSuccess]);

//   const FormContainer = () => {
//     return (
//       <Loading isLoading={isLoading}>
//         <Form
//           layout="vertical"
//           name="register_form"
//           className="register-form"
//           initialValues={{ remember: true }}
//           onFinish={onFinish}
//         >
//           <RegisterForm />
//           <Form.Item>
//             <Button
//               type="primary"
//               htmlType="submit"
//               className="register-form-button"
//               loading={isLoading}
//               size="large"
//             >
//               {translate('Register')}
//             </Button>
//             <a href="/" style={{ marginLeft: '10px' }}>
//               {translate('Back to Login')}
//             </a>
//           </Form.Item>
//         </Form>
//       </Loading>
//     );
//   };

//   return <AuthModule authContent={<FormContainer />} AUTH_TITLE="Register" />;
// };

// export default RegisterPage;


import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Input, message } from 'antd';
import useLanguage from '@/locale/useLanguage';
import Loading from '@/components/Loading';
import AuthModule from '@/modules/AuthModule';
import axios from 'axios';

// Redux action for registration
const register = ({ registerData }) => async (dispatch) => {
  dispatch({ type: 'AUTH_REQUEST' });
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_FILE_BASE_URL || 'http://localhost:3000/'}api/v1/user/create`,
      registerData
    );
    if (response.data.success) {
      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: { adminId: response.data.adminId },
      });
    } else {
      dispatch({
        type: 'REGISTER_FAIL',
        payload: response.data.message,
      });
    }
  } catch (error) {
    dispatch({
      type: 'REGISTER_FAIL',
      payload: error.response?.data?.message || 'Registration failed',
    });
  }
};

// Selector to access auth state
const selectAuth = (state) => state.auth;

const RegisterPage = () => {
  const translate = useLanguage();
  const { isLoading, isSuccess, error } = useSelector(selectAuth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isSuccess) {
      message.success(translate('Registration successful! Redirecting to login...'));
      setTimeout(() => navigate('/'), 1000); // Delay for user to see success message
    }
    if (error) {
      message.error(translate(error));
    }
  }, [isSuccess, error, navigate, translate]);

  const onFinish = (values) => {
    dispatch(register({ registerData: values }));
  };

  return (
    <AuthModule
      authContent={
        <Loading isLoading={isLoading}>
          <Form
            layout="vertical"
            name="register_form"
            className="register-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              label={translate('Name')}
              name="name"
              rules={[{ required: true, message: translate('Please input your name!') }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label={translate('Surname')}
              name="surname"
              rules={[{ required: true, message: translate('Please input your surname!') }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label={translate('Email')}
              name="email"
              rules={[
                { required: true, message: translate('Please input your email!') },
                { type: 'email', message: translate('Please enter a valid email!') },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label={translate('Password')}
              name="password"
              rules={[{ required: true, message: translate('Please input your password!') }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="register-form-button"
                loading={isLoading}
                size="large"
              >
                {translate('Register')}
              </Button>
              <a href="/" style={{ marginLeft: '10px' }}>
                {translate('Back to Login')}
              </a>
            </Form.Item>
          </Form>
        </Loading>
      }
      AUTH_TITLE="Register"
    />
  );
};

export default RegisterPage;