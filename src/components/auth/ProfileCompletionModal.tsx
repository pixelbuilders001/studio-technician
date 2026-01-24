"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { UserPlus, Star, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"

interface ProfileCompletionModalProps {
    isOpen: boolean
    onClose: () => void
}

export function ProfileCompletionModal({ isOpen, onClose }: ProfileCompletionModalProps) {
    const router = useRouter()

    const handleCompleteProfile = () => {
        onClose()
        router.push("/partner-signup")
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md border-none bg-white/95 backdrop-blur-xl shadow-2xl rounded-3xl p-0 overflow-hidden">
                <div className="relative h-32 bg-gradient-to-br from-primary via-primary/80 to-blue-600 flex items-center justify-center">
                    <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 bg-black/10 rounded-full blur-2xl"></div>

                    <div className="relative bg-white/20 backdrop-blur-md p-4 rounded-full border border-white/30 shadow-xl">
                        <UserPlus className="h-10 w-10 text-white" />
                    </div>
                </div>

                <div className="p-8 pb-10">
                    <DialogHeader className="text-center space-y-3">
                        <DialogTitle className="text-2xl font-black text-slate-900 font-headline leading-tight">
                            Complete Your Profile
                        </DialogTitle>
                        <DialogDescription className="text-slate-600 font-medium text-base">
                            To start receiving jobs and unlock all features, please complete your professional profile.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mt-8 space-y-4">
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 transition-colors">
                            <div className="p-2.5 bg-yellow-100 rounded-xl">
                                <Star className="h-5 w-5 text-yellow-600 fill-yellow-600" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900">Better Job Matching</p>
                                <p className="text-xs text-slate-500">Get jobs that match your skills</p>
                            </div>
                        </div>

                        <Button
                            className="w-full h-14 text-base font-bold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 rounded-2xl transition-all active:scale-[0.98] group"
                            onClick={handleCompleteProfile}
                        >
                            Complete Profile Now
                            <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </Button>

                        <Button
                            variant="ghost"
                            className="w-full h-12 text-slate-400 font-semibold hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
                            onClick={onClose}
                        >
                            Maybe Later
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
