export default function Error({ message }: { message: string }) {
  return <div className="text-red-400 text-sm">{message}</div>;
}
