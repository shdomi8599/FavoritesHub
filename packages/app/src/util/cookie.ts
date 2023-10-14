export const getCookie = (name: string) => {
  var value = document.cookie.match("(^|;) ?" + name + "=([^;]*)(;|$)");
  return value ? value[2] : null;
};

//쿠키 삭제하는 함수
export const deleteCookie = (name: string) => {
  document.cookie =
    encodeURIComponent(name) + "=; expires=Thu, 01 JAN 1999 00:00:10 GMT";
};
