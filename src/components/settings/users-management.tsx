"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  useRoles,
} from "@/hooks/use-settings";
import { toast } from "sonner";
import { Users, Mail, Phone, UserPlus } from "lucide-react";

interface UsersManagementProps {
  organizationId: string;
}

export function UsersManagement({ organizationId }: UsersManagementProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
  });

  const { data: users = [], isLoading } = useUsers(organizationId);
  const { data: roles = [] } = useRoles(organizationId);
  const createMutation = useCreateUser(organizationId);
  const updateMutation = useUpdateUser(organizationId);
  const deleteMutation = useDeleteUser(organizationId);

  const handleCreate = () => {
    setSelectedUser(undefined);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      role: "",
    });
    setIsModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email,
      phone: user.phone || "",
      role: user.role,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedUser) {
        await updateMutation.mutateAsync({
          id: selectedUser.id,
          data: formData,
        });
        toast.success("Utilisateur modifié avec succès");
      } else {
        await createMutation.mutateAsync(formData);
        toast.success("Utilisateur créé avec succès");
      }
      setIsModalOpen(false);
    } catch {
      toast.error("Une erreur est survenue");
    }
  };

  const handleDelete = async (user: User) => {
    if (confirm(`Supprimer l'utilisateur "${user.email}" ?`)) {
      try {
        await deleteMutation.mutateAsync(user.id);
        toast.success("Utilisateur supprimé avec succès");
      } catch {
        toast.error("Erreur lors de la suppression");
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      ACTIVE: { variant: "default" as const, text: "Actif" },
      INACTIVE: { variant: "secondary" as const, text: "Inactif" },
      PENDING: { variant: "destructive" as const, text: "En attente" },
    };

    const config =
      variants[status as keyof typeof variants] || variants.PENDING;

    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  if (isLoading) return <div>Chargement des utilisateurs...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des utilisateurs</h2>
        <Button onClick={handleCreate}>
          <UserPlus className="h-4 w-4 mr-2" />
          Nouvel utilisateur
        </Button>
      </div>

      {users.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              Aucun utilisateur trouvé
            </p>
            <Button onClick={handleCreate}>Créer le premier utilisateur</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <Card key={user.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>
                      {user.firstName} {user.lastName}
                    </span>
                  </div>
                  {getStatusBadge(user.status)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Rôle:</span> {user.role}
                  </div>
                  {user.lastLogin && (
                    <div>
                      <span className="font-medium">Dernière connexion:</span>{" "}
                      {new Date(user.lastLogin).toLocaleDateString()}
                    </div>
                  )}
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(user)}
                  >
                    Modifier
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(user)}
                  >
                    Supprimer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedUser ? "Modifier l'utilisateur" : "Nouvel utilisateur"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">Prénom</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="lastName">Nom</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="role">Rôle *</Label>
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  setFormData({ ...formData, role: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.name}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {selectedUser ? "Modifier" : "Créer"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
