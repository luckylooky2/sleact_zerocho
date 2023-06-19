// custom hook이 특별한 것이 아님!
// React에서 제공하는 hook을 하나로 합쳐 새로운 hook을 만드는 것
import { ChangeEvent, Dispatch, SetStateAction, useCallback, useState } from 'react';

// ts
// 1. 변수, return type은 추론을 잘 하는데 매개 변수는 잘 하지 못함 => 매개 변수는 대부분 type을 명시해야 함
// - 여러 타입이 들어올 수 있기 때문에, 특정할 수 없는 경우
// - 1) any
// - 2) generic : T로 정의한 타입 매개 변수를 함수 내에서 그대로 사용할 수 있음
// 2. 가독성이 좋지 않아지는 경우가 많음
// - type 키워드를 이용해 변수화가 가능!

type useInpuReturnType<T = any> = [T, (e: ChangeEvent<HTMLInputElement>) => void, Dispatch<SetStateAction<T>>];

const useInput = <T = any>(initialData: T): useInpuReturnType<T> => {
  const [value, setValue] = useState(initialData);

  const handler = useCallback((e) => {
    setValue(e.target.value as unknown as T);
  }, []);

  return [value, handler, setValue];
};

export default useInput;

// custom hook
// 1. Custom Hook은 일반 함수이며, 컴포넌트의 라이프사이클에 직접적으로 연결되지 않습니다.
// - Custom Hook 내부에서 사용되는 useEffect는 Custom Hook이 호출되는 컴포넌트의 라이프사이클과는 독립적으로 동작합니다.
// - Custom Hook이 호출될 때마다 해당 useEffect는 실행되고, 그에 따라 특정 작업이 수행됩니다.
// - Custom Hook을 사용하는 컴포넌트는 이 _Custom Hook이 반환한 값이나 기능을 활용할 수 있지만_
// - 컴포넌트의 라이프사이클과 Custom Hook 내부의 useEffect는 독립적으로 동작합니다.
// 2. Custom Hook은 클로저의 개념을 사용하는 것이 일반적입니다.
// - Custom Hook은 클로저의 원리를 활용하여 호출된 이후의 실행 컨텍스트에 접근할 수 있습니다.
// - 이를 통해 Custom Hook 내부에서 선언된 변수나 함수가 해당 컴포넌트와 관련된 실행 컨텍스트에서 유지되고 사용될 수 있습니다.
// 3. Custom Hook은 React 훅의 원리를 활용하여 로직을 추상화하고 재사용 가능하게 만드는 것이 주요 목적입니다.
// 4. React 컴포넌트는 마운트, 업데이트, 언마운트 등의 라이프사이클 단계에 따라 특정한 동작을 수행할 수 있습니다.
// - 하지만 Custom Hook은 단순히 함수로 구현되기 때문에 컴포넌트의 라이프사이클과 직접적으로 연결되지 않습니다.
// - Custom Hook 내에서 useState, useEffect 등의 훅을 사용해도 **해당 훅은 Custom Hook이 호출되는 시점에 실행되며, 컴포넌트의 라이프사이클과 동일한 타이밍으로 실행되지 않습니다.**
// - 이는 Custom Hook이 여러 컴포넌트에서 재사용될 수 있고, 각 컴포넌트에서 독립적으로 동작할 수 있는 유연성을 제공합니다.
// - Custom Hook을 사용하는 컴포넌트에서는 Custom Hook 내의 훅을 호출하는 시점과 로직을 조절하여 필요한 동작을 수행할 수 있습니다.
// - 그렇기 때문에 더 많은 유연성과 재사용성을 가질 수 있습니다.
// 5. React의 함수형 컴포넌트는 함수 호출 시마다 새로운 실행 컨텍스트가 생성됩니다.
