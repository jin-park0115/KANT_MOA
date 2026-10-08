import { Input } from "@/components/ui";
import { formatPhone, type AddressDraft, type AddressDraftErrors } from "./addressDraft";

interface AddressFieldsProps {
  value: AddressDraft;
  errors?: AddressDraftErrors;
  onChange: (next: AddressDraft) => void;
  /** 같은 화면에 폼이 둘 이상일 때 id가 겹치지 않게 붙이는 접두어 */
  idPrefix?: string;
  showLabel?: boolean;
}

/** 배송지 입력 칸 묶음. <form>은 쓰는 쪽에서 감싼다. */
export function AddressFields({ value, errors = {}, onChange, idPrefix = "address", showLabel = true }: AddressFieldsProps) {
  const set = (field: keyof AddressDraft) => (event: { target: { value: string } }) =>
    onChange({ ...value, [field]: field === "recipientPhone" ? formatPhone(event.target.value) : event.target.value });

  return (
    <div className="space-y-5">
      {showLabel && (
        <Input id={`${idPrefix}-label`} label="배송지명 (선택)" name="label" placeholder="집, 회사" value={value.label} onChange={set("label")} maxLength={20} />
      )}
      <div className="grid gap-5 sm:grid-cols-2">
        <Input id={`${idPrefix}-name`} label="받는 분" name="recipientName" value={value.recipientName} onChange={set("recipientName")} error={errors.recipientName} autoComplete="name" />
        <Input id={`${idPrefix}-phone`} label="연락처" name="recipientPhone" type="tel" inputMode="numeric" placeholder="010-1234-5678" value={value.recipientPhone} onChange={set("recipientPhone")} error={errors.recipientPhone} autoComplete="tel" />
      </div>
      <Input id={`${idPrefix}-postal`} label="우편번호" name="postalCode" inputMode="numeric" placeholder="12345" maxLength={5} value={value.postalCode} onChange={set("postalCode")} error={errors.postalCode} autoComplete="postal-code" className="max-w-40" />
      <Input id={`${idPrefix}-address1`} label="기본 주소" name="address1" placeholder="도로명 또는 지번 주소" value={value.address1} onChange={set("address1")} error={errors.address1} autoComplete="address-line1" />
      <Input id={`${idPrefix}-address2`} label="상세 주소 (선택)" name="address2" placeholder="동·호수 등" value={value.address2} onChange={set("address2")} autoComplete="address-line2" />
    </div>
  );
}
