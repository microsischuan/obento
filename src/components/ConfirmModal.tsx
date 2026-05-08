import { Trash2 } from "lucide-react";

type Props = {
  open: boolean;
  title: string;
  text: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ConfirmModal({ open, title, text, onCancel, onConfirm }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(40,50,45,0.35)] p-5 backdrop-blur-[4px]">
      <div className="w-full max-w-[320px] rounded-[20px] border border-[#e0dcd4] bg-white px-6 pb-[22px] pt-[22px] text-center">
        <div className="mx-auto mb-2.5 flex h-11 w-11 items-center justify-center rounded-full bg-[#f5ede6] text-[#c17f5a]">
          <Trash2 className="h-5.5 w-5.5" />
        </div>
        <h3 className="mb-1 text-[15px] font-medium">{title}</h3>
        <p className="mb-4 text-[13px] leading-[1.5] text-[#6b6a66]">{text}</p>
        <div className="flex justify-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-[9px] border border-[#e0dcd4] bg-white px-3 py-1.5 text-xs hover:bg-[#f5f2ed]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex items-center gap-1 rounded-[9px] border border-[#c17f5a] bg-[#c17f5a] px-3 py-1.5 text-xs text-white hover:border-[#a86a48] hover:bg-[#a86a48]"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
