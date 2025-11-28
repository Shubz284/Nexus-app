export default function Input({reference,  placeholder }:
     { placeholder:string; reference?:any;}) {
  return (
    <div>
      <input
        ref={reference}
        type="text"
        placeholder={placeholder}
        required
        className="text-md  rounded border border-neutral-400 px-4 py-2 outline-none"
      />
    </div>
  );
}
