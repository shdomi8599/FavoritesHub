import Swal from "sweetalert2";

export const successAlert = (text: string, title: string) => {
  Swal.fire({
    title: title,
    text: text,
    icon: "success",
    confirmButtonText: "확인",
    confirmButtonColor: "rgb(165,220,134)",
  });
};

export const errorAlert = (text: string, title: string) => {
  Swal.fire({
    title: title,
    text: text,
    icon: "error",
    confirmButtonText: "확인",
    confirmButtonColor: "#F27474",
  });
};

export const confirmAlert = (text: string, title: string) => {
  return new Promise<void>((resolve, reject) => {
    Swal.fire({
      title: text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "rgb(165,220,134)",
      cancelButtonColor: "#F27474",
      confirmButtonText: "확인",
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: title.slice(0, -1),
          text: `${title} 완료되었습니다.`,
          icon: "success",
          confirmButtonText: "확인",
          confirmButtonColor: "rgb(165,220,134)",
        }).then(() => {
          resolve();
        });
      } else {
        Swal.fire({
          title: title.slice(0, -1),
          text: `${title} 취소되었습니다.`,
          icon: "error",
          confirmButtonText: "확인",
          confirmButtonColor: "#F27474",
        }).then(() => {
          reject();
        });
      }
    });
  });
};

export const signUpAlert = (callback: () => void) => {
  return new Promise<void>((resolve) => {
    Swal.fire({
      title: "회원가입을 축하합니다.",
      icon: "success",
      confirmButtonColor: "rgb(165,220,134)",
      cancelButtonColor: "#F27474",
      confirmButtonText: "로그인",
    })
      .then((result) => {
        if (result.isConfirmed) {
          callback();
        }
      })
      .then(() => {
        resolve();
      });
  });
};

export const successToast = (text: string, callback?: () => void) => {
  Swal.fire({
    icon: "success",
    title: text,
    toast: true,
    position: "center",
    showConfirmButton: false,
    timer: 1000,
    timerProgressBar: true,
  }).then(() => {
    if (callback) {
      callback();
    }
  });
};

export const errorToast = (text: string) => {
  Swal.fire({
    icon: "error",
    title: text,
    toast: true,
    position: "center",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
  });
};
