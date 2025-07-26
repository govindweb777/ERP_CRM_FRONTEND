import { Button, Result } from 'antd';

import useLanguage from '@/locale/useLanguage';

const About = () => {
  const translate = useLanguage();
  return (
    <Result
      status="info"
      title={'WebSeeder Technologies'}
      subTitle={translate('Do you need help on customize of this app')}
      extra={
        <>
          <p>
            Website : <a href="https://www.webseeder.in/">https://www.webseeder.in/</a>{' '}
          </p>
          {/* <p>
            GitHub :{' '}
            <a href="https://github.com/idurar/idurar-erp-crm">
              https://github.com/idurar/idurar-erp-crm
            </a>
          </p> */}
          <Button
            type="primary"
            onClick={() => {
              window.open(`https://www.webseeder.in/contact-us/`);
            }}
          >
            {translate('Contact us')}
          </Button>
        </>
      }
    />
  );
};

export default About;
