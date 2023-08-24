import { useState, useEffect } from 'react';
import InAndOutPage from './InAndOutPage';
import DumbInAndOutAccessPage from './DumbInAndOutAccessPage';
import config from '../../../../config';

export default function InAndOutAccessPage(props) {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [schoolName, setSchoolName] = useState('');
  const [errors, setErrors] = useState({});
  const [isLogged, setIslogged] = useState(false);

  useEffect(() => {
    fetch(`${config.apiEndpoint}/getSchoolName`, {
      headers: new Headers({
        "Access-Control-Allow-Origin": config.domainName ? `*.${config.domainName}` : '*',
      }),
    })
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        throw new Error('Aucune école trouvée pour cette url');
      }
    })
    .then((res) => {
      setSchoolName(res.schoolName);
    });
  }, []);

  useEffect(() => {}, [isLogged]);

  const onCodeChange = code => {
    setErrors({ ...errors, code: '' });
    setCode(code);
  };

  const getInandoutjwt = () => {
    localStorage.getItem('inandoutjwt');
  };

  const removeInandoutjwt = () => {
    localStorage.removeItem('inandoutjwt');
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    fetch(`${config.apiEndpoint}/inandoutlogin`, {
      method: 'POST',
      headers: new Headers({
        Accept: 'application/json',
        "Access-Control-Allow-Origin": config.domainName ? `*.${config.domainName}` : '*',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ accessCode: code }),
    })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else {
          throw new Error('Wrong access code');
        }
      })
      .then((res) => {
        localStorage.setItem('inandoutjwt', res.inandoutjwt);
        setIslogged(true);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
        setErrors({ ...props.errors, code: 'Code incorrect' });
      });
  };

  if (localStorage.getItem('inandoutjwt')) {
    return <InAndOutPage getInandoutjwt={getInandoutjwt} removeInandoutjwt={removeInandoutjwt} />
  }

  return <DumbInAndOutAccessPage
    isLoading={isLoading}
    schoolName={schoolName}
    onCodeChange={onCodeChange}
    onSubmit={onSubmit}
    code={code}
    errors={errors}
  />
}
