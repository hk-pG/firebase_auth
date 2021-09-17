import { FC, useEffect, useState } from 'react';
import { db } from '../../config.rnk';
import UserCard from '../organisms/UserCard';

const Nearly15: FC = () => {
  const [data, setData] = useState([{ name: '', score: 0, life: 0 }]);
  const profRef = db.collection('second');

  useEffect(() => {
    const unSub = profRef
      .orderBy('life', 'desc')
      .orderBy('score', 'desc')
      .onSnapshot((snapshot) => {
        console.log('useEffect process');
        setData(
          snapshot.docs.map((doc) => ({
            name: doc.data().name,
            life: doc.data().life,
            score: doc.data().score,
          }))
        );
      });
    return () => unSub();
  }, []);

  return (
    <>
      {data.map((doc, i) => {
        console.log(`${i}: ${doc}`);
        return (
          <UserCard
            className={`user-card number-${i + 1}`}
            key={i}
            index={i}
            name={doc.name}
            score={doc.score}
            life={doc.life}
          />
        );
      })}
    </>
  );
};

export { Nearly15 };
