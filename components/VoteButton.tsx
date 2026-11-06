"use client";

import { useActionState, useState } from "react";
import { castVote, type VoteState } from "@/app/actions";

export function VoteButton({ projectId, team }: { projectId: string; team: string }) {
  const [confirming, setConfirming] = useState(false);
  const [state, action, pending] = useActionState<VoteState, FormData>(
    castVote.bind(null, projectId),
    null,
  );

  if (!confirming) {
    return (
      <div className="stack">
        <button className="btn btn-primary" onClick={() => setConfirming(true)}>
          โหวตผลงานนี้
        </button>
        <p className="hint">โหวตได้หลายเกม เกมละ 1 ครั้ง</p>
      </div>
    );
  }

  return (
    <form action={action} className="confirm">
      <p className="confirm-title">ยืนยันโหวตให้ “{team}” ?</p>
      <p className="hint">โหวตแล้วยกเลิกไม่ได้ · เกมอื่นยังโหวตต่อได้</p>
      {state?.error && <p className="error">{state.error}</p>}
      <div className="row">
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => setConfirming(false)}
          disabled={pending}
        >
          ยกเลิก
        </button>
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? "กำลังบันทึก…" : "ยืนยันโหวต"}
        </button>
      </div>
    </form>
  );
}
