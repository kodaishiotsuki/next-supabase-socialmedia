
type AvatarProps = {
  size?: string;
  url?: string;
};

const Avatar = ({ size, url }: AvatarProps) => {
  let width = "w-12";
  if (size === "lg") {
    width = "w-24 md:w-36";
  }
  return (
    <div className={`${width} rounded-full overflow-hidden`}>
      <img src={url!} alt="" className="w-full" />
    </div>
  );
};
export default Avatar;
