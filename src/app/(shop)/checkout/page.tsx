"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Button, Card, EmptyState, Input, SectionHeader, Skeleton } from "@/components/ui";
import { getErrorCode, getErrorMessage } from "@/constants/error-messages";
import { useCart } from "@/hooks/useCart";
import { createOrder, getProfile, payOrder } from "@/mocks/orders";

type FormErrors = Partial<Record<"recipientName" | "recipientPhone" | "address", string>>;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalQuantity, totalPrice, loaded, refresh } = useCart();
  const [form, setForm] = useState({ recipientName: "", recipientPhone: "", address: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // 배송 정보 기본값: 프로필의 닉네임/연락처 (주소는 저장하지 않음)
  useEffect(() => {
    getProfile().then((profile) => {
      if (profile) {
        setForm((prev) => ({
          ...prev,
          recipientName: prev.recipientName || profile.nickname,
          recipientPhone: prev.recipientPhone || (profile.phone ?? ""),
        }));
      }
    });
  }, []);

  function validate(): FormErrors {
    const next: FormErrors = {};
    if (!form.recipientName.trim()) next.recipientName = "받는 분 이름을 입력해주세요.";
    if (!/^01\d{8,9}$/.test(form.recipientPhone.replace(/-/g, ""))) next.recipientPhone = "휴대폰 번호를 정확히 입력해주세요.";
    if (!form.address.trim()) next.address = "배송 주소를 입력해주세요.";
    return next;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    setSubmitError(null);
    let orderId: string;
    try {
      orderId = await createOrder({
        recipientName: form.recipientName.trim(),
        recipientPhone: form.recipientPhone.trim(),
        address: form.address.trim(),
      });
    } catch (error) {
      if (getErrorCode(error) === "NOT_AUTHENTICATED") return router.push("/login?next=/checkout");
      setSubmitError(getErrorMessage(error));
      setSubmitting(false);
      return;
    }

    try {
      await payOrder(orderId);
    } catch {
      // 결제가 실패하면 주문은 결제 대기로 남는다. 주문 상세에서 다시 결제하거나 취소할 수 있다.
    }
    await refresh();
    router.push(`/orders/${orderId}`);
  }

  const update = (field: keyof typeof form) => (event: { target: { value: string } }) =>
    setForm((prev) => ({ ...prev, [field]: event.target.value }));

  if (!loaded) {
    return (
      <div className="content-shell py-8 md:py-12">
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (items.length === 0 && !submitting) {
    return (
      <div className="content-shell py-8 md:py-12">
        <EmptyState
          title="주문할 상품이 없어요"
          description="장바구니에 상품을 담아주세요."
          action={<Button onClick={() => router.push("/cart")}>장바구니로 가기</Button>}
        />
      </div>
    );
  }

  return (
    <div className="content-shell py-8 md:py-12">
      <SectionHeader title="주문서" description="배송 정보를 입력하고 결제해주세요." />
      <form onSubmit={handleSubmit} noValidate className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
        <div className="space-y-6">
          <Card className="space-y-5 p-6">
            <h2 className="text-lg font-black">배송 정보</h2>
            <Input label="받는 분" name="recipientName" value={form.recipientName} onChange={update("recipientName")} error={errors.recipientName} autoComplete="name" />
            <Input label="연락처" name="recipientPhone" type="tel" inputMode="tel" placeholder="01012345678" value={form.recipientPhone} onChange={update("recipientPhone")} error={errors.recipientPhone} autoComplete="tel" />
            <Input label="주소" name="address" value={form.address} onChange={update("address")} error={errors.address} autoComplete="street-address" />
          </Card>

          <Card className="px-6">
            <h2 className="pt-6 text-lg font-black">주문 상품 {totalQuantity}개</h2>
            <ul className="divide-y divide-line">
              {items.map((item) => (
                <li key={item.variantId} className="flex justify-between gap-4 py-4 text-sm">
                  <div className="min-w-0">
                    <p className="font-bold">{item.product.name}</p>
                    <p className="mt-1 text-xs text-muted">{item.optionName} · {item.quantity}개</p>
                  </div>
                  <p className="shrink-0 font-bold">{(item.unitPrice * item.quantity).toLocaleString("ko-KR")}원</p>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <Card className="p-6 lg:sticky lg:top-24">
          <h2 className="text-lg font-black">결제 금액</h2>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between border-t border-line pt-3 text-base">
              <dt className="font-bold">총 결제 금액</dt>
              <dd className="font-black">{totalPrice.toLocaleString("ko-KR")}원</dd>
            </div>
          </dl>
          <p className="mt-3 text-xs text-muted">실제 결제는 이루어지지 않는 테스트 결제예요.</p>
          {submitError && <p role="alert" className="mt-4 text-sm text-danger">{submitError}</p>}
          <Button type="submit" fullWidth size="lg" className="mt-6" loading={submitting}>결제하기</Button>
        </Card>
      </form>
    </div>
  );
}
