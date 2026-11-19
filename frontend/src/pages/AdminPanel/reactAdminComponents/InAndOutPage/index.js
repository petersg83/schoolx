import { useState, useEffect } from 'react';
import InAndOutPage from './InAndOutPage';
import DumbInAndOutAccessPage from './DumbInAndOutAccessPage';
import config from '../../../../config';

export default function InAndOutAccessPage(props) {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [schoolName, setSchoolName] = useState('');
  const [errors, setErrors] = useState({});
  const [isLogged, setIslogged] = useState(() => !!localStorage.getItem('inandoutjwt'));

  useEffect(() => {
    fetch(`${config.apiEndpoint}/getSchoolName`)
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

  const onCodeChange = code => {
    setErrors({ ...errors, code: '' });
    setCode(code);
  };

  const removeInandoutjwt = () => {
    localStorage.removeItem('inandoutjwt');
    setIslogged(false);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    fetch(`${config.apiEndpoint}/inandoutlogin`, {
      method: 'POST',
      headers: new Headers({
        Accept: 'application/json',
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

  if (isLogged) {
    return <InAndOutPage removeInandoutjwt={removeInandoutjwt} />
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
