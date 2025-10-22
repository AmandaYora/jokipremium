import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Edit2, Save, X, Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface SettingRowProps {
  keyName: string;
  value: string;
  isSensitive: boolean;
  description?: string;
  onReveal: (key: string) => Promise<string>;
  onUpdate: (key: string, value: string) => Promise<void>;
}

export const SettingRow = ({ keyName, value, isSensitive, description, onReveal, onUpdate }: SettingRowProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [displayValue, setDisplayValue] = useState(value);
  const [showValue, setShowValue] = useState(false);
  const [showConfirmReveal, setShowConfirmReveal] = useState(false);
  const [showConfirmSave, setShowConfirmSave] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReveal = async () => {
    setLoading(true);
    try {
      const actualValue = await onReveal(keyName);
      setDisplayValue(actualValue);
      setEditValue(actualValue);
      setShowValue(true);
    } finally {
      setLoading(false);
      setShowConfirmReveal(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await onUpdate(keyName, editValue);
      setDisplayValue(isSensitive ? '••••••••••••••••' : editValue);
      setIsEditing(false);
      setShowValue(false);
    } finally {
      setLoading(false);
      setShowConfirmSave(false);
    }
  };

  const handleCancel = () => {
    setEditValue(displayValue);
    setIsEditing(false);
    setShowValue(false);
  };

  const handleToggleVisibility = () => {
    if (!showValue && isSensitive) {
      setShowConfirmReveal(true);
    } else {
      setShowValue(!showValue);
      if (!showValue) {
        setDisplayValue(value);
      }
    }
  };

  return (
    <>
      <div className="flex flex-col gap-3 p-4 rounded-lg border border-border bg-card/50">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-sm">{keyName}</h3>
              {isSensitive && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-destructive/10 text-destructive">
                  Sensitive
                </span>
              )}
            </div>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isSensitive && !isEditing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleVisibility}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : showValue ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            )}
            {!isEditing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Input
                type={isSensitive && !showValue ? 'password' : 'text'}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="flex-1"
                placeholder={`Enter ${keyName}`}
              />
              <Button
                variant="default"
                size="sm"
                onClick={() => setShowConfirmSave(true)}
                disabled={loading || editValue === displayValue}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                disabled={loading}
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <div className="flex-1 px-3 py-2 rounded-md bg-muted/50 text-sm font-mono break-all">
              {showValue ? displayValue : value}
            </div>
          )}
        </div>
      </div>

      <AlertDialog open={showConfirmReveal} onOpenChange={setShowConfirmReveal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reveal Sensitive Value?</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to reveal the actual value of <strong>{keyName}</strong>.
              This action will be logged in the audit trail.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReveal}>Reveal</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showConfirmSave} onOpenChange={setShowConfirmSave}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update Setting?</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to update <strong>{keyName}</strong>.
              {isSensitive && ' This value will be encrypted before storage.'}
              {' '}This action will be logged in the audit trail.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSave}>Save Changes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
