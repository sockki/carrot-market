import { useState } from "react";

interface UseMutationState<T> {
    loading: boolean;
    data?:T;
    error?:object;
}

type UseMutationResult<T> = [(data: any) => void, UseMutationState<T>]

  // 1.POST 로 fetch
    // 2.data를 stringify
    // 3.Content-type 설정
    // 4.사용자에게 submitting인지 보여줘야 함
export default function useMutation<T = any>(url: string): UseMutationResult<T> {
    const [state, setState] = useState<UseMutationState<T>>({
        loading: false,
        data: undefined,
        error: undefined,
      });
      function mutation(data: any) {
        setState((prev) => ({ ...prev, loading: true }));
        fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
          .then((response) => response.json().catch(() => {}))
          .then((data) => setState((prev) => ({ ...prev, data })))
          .catch((error) => setState((prev) => ({ ...prev, error })))
          .finally(() => setState((prev) => ({ ...prev, loading: false })));
      }
      return [mutation, { ...state }];
}


// typescript에서는 return type과 input type을 잘 정의 해주면 오류가 없다