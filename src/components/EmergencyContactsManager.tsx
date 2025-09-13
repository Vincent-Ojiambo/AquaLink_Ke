import { useState } from 'react';
import { Plus, Trash2, Edit, Phone, Mail, User, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useEmergencyContacts, type EmergencyContact } from '../hooks/useEmergencyContacts';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from './ui/dialog';
import { useToast } from './ui/use-toast';

interface EmergencyContactsManagerProps {
  onClose?: () => void;
}

export function EmergencyContactsManager({ onClose }: EmergencyContactsManagerProps) {
  const { contacts, loading, error, addContact, updateContact, deleteContact } = useEmergencyContacts();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentContact, setCurrentContact] = useState<Partial<EmergencyContact> | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentContact?.name || !currentContact.phone_number) {
      toast({
        title: 'Error',
        description: 'Name and phone number are required',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (isEditing && currentContact.id) {
        await updateContact(currentContact.id, {
          name: currentContact.name,
          phone_number: currentContact.phone_number,
          email: currentContact.email || null,
          relationship: currentContact.relationship || null,
          is_primary: currentContact.is_primary || false,
        });
        toast({
          title: 'Success',
          description: 'Contact updated successfully',
        });
      } else {
        await addContact({
          name: currentContact.name,
          phone_number: currentContact.phone_number,
          email: currentContact.email || '',
          relationship: currentContact.relationship || '',
          is_primary: currentContact.is_primary || false,
        });
        toast({
          title: 'Success',
          description: 'Contact added successfully',
        });
      }
      
      // Close the dialog and reset form
      setIsDialogOpen(false);
      resetForm();
      
      // Call onClose if provided
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error saving contact:', error);
      toast({
        title: 'Error',
        description: 'Failed to save contact. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (contact: EmergencyContact) => {
    setCurrentContact({ ...contact });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await deleteContact(id);
        toast({
          title: 'Success',
          description: 'Contact deleted successfully',
        });
        setIsDialogOpen(false);
        // Close the dialog if onClose is provided and there are no more contacts
        if (onClose && contacts.length <= 1) {
          onClose();
        }
      } catch (error) {
        console.error('Error deleting contact:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete contact',
          variant: 'destructive',
        });
      }
    }
    setIsEditing(false);
  };

  const resetForm = () => {
    setCurrentContact({
      name: '',
      phone_number: '',
      email: '',
      relationship: '',
      is_primary: contacts.length === 0,
    });
    setIsEditing(false);
  };

  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      resetForm();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Emergency Contacts</h3>
        <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button 
              size="sm" 
              onClick={() => {
                resetForm();
                setIsDialogOpen(true);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Contact
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isEditing ? 'Edit Emergency Contact' : 'Add Emergency Contact'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={currentContact?.name || ''}
                  onChange={(e) =>
                    setCurrentContact({ ...currentContact, name: e.target.value })
                  }
                  placeholder="Contact name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-gray-500">+254</span>
                  </div>
                  <Input
                    id="phone"
                    type="tel"
                    className="pl-16"
                    value={(currentContact?.phone_number || '').replace(/^\+254/, '')}
                    onChange={(e) =>
                      setCurrentContact({
                        ...currentContact,
                        phone_number: `+254${e.target.value.replace(/\D/g, '')}`,
                      })
                    }
                    placeholder="700 000 000"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={currentContact?.email || ''}
                  onChange={(e) =>
                    setCurrentContact({ ...currentContact, email: e.target.value })
                  }
                  placeholder="contact@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="relationship">Relationship (Optional)</Label>
                <Input
                  id="relationship"
                  value={currentContact?.relationship || ''}
                  onChange={(e) =>
                    setCurrentContact({ ...currentContact, relationship: e.target.value })
                  }
                  placeholder="e.g., Spouse, Parent, Friend"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_primary"
                  checked={currentContact?.is_primary || false}
                  onChange={(e) =>
                    setCurrentContact({ ...currentContact, is_primary: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="is_primary" className="text-sm font-medium">
                  Set as primary contact
                </Label>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {isEditing ? 'Update Contact' : 'Add Contact'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading && <div className="text-center py-4">Loading contacts...</div>}
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      {!loading && contacts.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground mb-4">No emergency contacts added yet</p>
          <Button
            onClick={() => {
              resetForm();
              setIsDialogOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Contact
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className={`flex items-center justify-between p-4 border rounded-lg ${
                contact.is_primary ? 'border-primary bg-primary/5' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center">
                    <span className="font-medium">{contact.name}</span>
                    {contact.is_primary && (
                      <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary">
                        Primary
                      </span>
                    )}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <Phone className="w-3.5 h-3.5 mr-1.5" />
                    <span>{contact.phone_number}</span>
                    {contact.email && (
                      <>
                        <span className="mx-2">•</span>
                        <Mail className="w-3.5 h-3.5 mr-1.5" />
                        <span>{contact.email}</span>
                      </>
                    )}
                    {contact.relationship && (
                      <>
                        <span className="mx-2">•</span>
                        <span className="text-xs px-2 py-0.5 bg-muted rounded-full">
                          {contact.relationship}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(contact)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => contact.id && handleDelete(contact.id)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
