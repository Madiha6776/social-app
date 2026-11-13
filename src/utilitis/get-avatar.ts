export function getAvatar(user?: { _id?: string; photo?: string }) {
  const me = JSON.parse(localStorage.getItem("user") || "null");

  const isDefault = !user?.photo || user.photo.includes("default-profile");
  const isMe = user?._id === me?._id;

  
  //  لو ده أنا ومعنديش صورة  gender صورة على حسب
  if (isMe && isDefault) {
    return me?.gender === "female" ? "/img/female.png" : "/img/male.png";
  }

  return user?.photo;
}