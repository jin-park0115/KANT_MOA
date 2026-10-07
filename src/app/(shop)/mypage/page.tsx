"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { Button, Card, EmptyState, Input, SectionHeader, Skeleton } from "@/components/ui";
import { getErrorMessage } from "@/constants/error-messages";
import { getProfile, updateProfile, type Profile } from "@/mocks/orders";

export default function MyPage() {
  const [profile, setProfile] = useState<Profile | null | undefined>(undefined); // undefined = 로딩 중, null = 비로그인
  const [form, setForm] = useState({ nickname: "", phone: "" });
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getProfile().then((result) => {
      setProfile(result);
      if (result) setForm({ nickname: result.nickname, phone: result.phone ?? "" });
    });
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!form.nickname.trim()) return setMessage({ type: "error", text: "닉네임을 입력해주세요." });

    setSaving(true);
    setMessage(null);
    try {
      setProfile(await updateProfile({ nickname: form.nickname.trim(), phone: form.phone.trim() }));
      setMessage({ type: "ok", text: "저장했어요." });
    } catch (error) {
      setMessage({ type: "error", text: getErrorMessage(error) });
    }
    setSaving(false);
  }

  if (profile === undefined) {
    return (
      <div className="content-shell py-8 md:py-12">
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (profile === null) {
    return (
      <div className="content-shell py-8 md:py-12">
        <EmptyState title="로그인이 필요해요" action={<Link href="/login?next=/mypage"><Button>로그인하기</Button></Link>} />
      </div>
    );
  }

  return (
    <div className="content-shell max-w-3xl py-8 md:py-12">
      <SectionHeader title="마이페이지" />
      <div className="space-y-6">
        <Card className="space-y-1 p-6">
          <p className="text-lg font-black">{profile.nickname}</p>
          <p className="text-sm text-muted">{profile.email}</p>
        </Card>

        <Link href="/orders" className="block">
          <Card className="flex items-center justify-between p-5 font-bold transition-shadow hover:shadow-lg">
            주문 내역<span aria-hidden="true">›</span>
          </Card>
        </Link>

        <Card className="p-6">
          <h2 className="text-lg font-black">내 정보 수정</h2>
          <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-5">
            <Input label="닉네임" name="nickname" value={form.nickname} onChange={(e) => setForm((prev) => ({ ...prev, nickname: e.target.value }))} />
            <Input label="연락처" name="phone" type="tel" inputMode="tel" value={form.phone} onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))} />
            {message && (
              <p role={message.type === "error" ? "alert" : "status"} className={`text-sm ${message.type === "error" ? "text-danger" : "text-brand-strong"}`}>
                {message.text}
              </p>
            )}
            <Button type="submit" loading={saving}>저장</Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
