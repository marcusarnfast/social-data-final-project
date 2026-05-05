"use client"

import * as React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  feedAd,
  feedAdRedeemRequiredPhrase,
  feedProfile,
} from "@/data/feed-mock"

export function FeedAdRedeemSection() {
  const [open, setOpen] = React.useState(false)
  const [phrase, setPhrase] = React.useState("")
  const inputId = React.useId()

  const matches = phrase.trim() === feedAdRedeemRequiredPhrase

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) setPhrase("")
  }

  function handleConfirm() {
    if (!matches) return
    handleOpenChange(false)
  }

  return (
    <>
      <Card size="sm" className="border border-border shadow-none ring-0">
        <CardContent className="space-y-3">
          <div className="flex items-start gap-2">
            <Avatar className="size-10">
              <AvatarImage src={feedProfile.avatarSrc} alt={feedProfile.name} />
              <AvatarFallback>{feedProfile.initials}</AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-1 items-start gap-2">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-sm bg-primary text-[10px] font-bold text-primary-foreground">
                CI
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-foreground">
                  {feedAd.title}
                </p>
                <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
                  {feedAd.body}
                </p>
              </div>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full rounded-full border-primary text-primary hover:bg-primary/10"
            onClick={() => setOpen(true)}
          >
            {feedAd.cta}
          </Button>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Redeem offer</DialogTitle>
            <DialogDescription asChild>
              <div>
                <p>Type the sentence below exactly in the box (same spelling and punctuation).</p>
                <p className="mt-2 rounded-md bg-muted/80 px-2 py-2 font-mono text-[11px] leading-snug text-foreground">
                  {feedAdRedeemRequiredPhrase}
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <Label htmlFor={inputId}>Your declaration</Label>
            <Textarea
              id={inputId}
              value={phrase}
              onChange={(e) => setPhrase(e.target.value)}
              rows={4}
              autoComplete="off"
              spellCheck={false}
              placeholder="Type here…"
              aria-invalid={phrase.length > 0 && !matches}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="button" disabled={!matches} onClick={handleConfirm}>
              Confirm redemption
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
