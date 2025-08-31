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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Send, Star } from "lucide-react";

export function FeedbackForm() {
  const [formData, setFormData] = useState({
    type: "",
    subject: "",
    message: "",
    rating: 0,
    email: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.type || !formData.subject || !formData.message) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulation d&apos;envoi
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("Feedback envoyé avec succès ! Merci pour votre retour.");
      setFormData({
        type: "",
        subject: "",
        message: "",
        rating: 0,
        email: "",
      });
    } catch {
      toast.error("Erreur lors de l&apos;envoi du feedback");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRating = (rating: number) => {
    setFormData({ ...formData, rating });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Envoyer un feedback</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Send className="h-5 w-5" />
            <span>Votre avis nous intéresse</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="type">Type de feedback *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bug">Signaler un bug</SelectItem>
                  <SelectItem value="feature">
                    Demande de fonctionnalité
                  </SelectItem>
                  <SelectItem value="improvement">Amélioration</SelectItem>
                  <SelectItem value="compliment">Compliment</SelectItem>
                  <SelectItem value="complaint">Plainte</SelectItem>
                  <SelectItem value="other">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="subject">Sujet *</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                placeholder="Résumé de votre feedback..."
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email (optionnel)</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Pour vous recontacter si nécessaire..."
              />
            </div>

            <div>
              <Label>Note globale</Label>
              <div className="flex items-center space-x-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Button
                    key={star}
                    type="button"
                    onClick={() => handleRating(star)}
                    className={`p-1 ${
                      star <= formData.rating
                        ? "text-yellow-500"
                        : "text-gray-300"
                    }`}
                  >
                    <Star className="h-6 w-6 fill-current" />
                  </Button>
                ))}
                {formData.rating > 0 && (
                  <span className="ml-2 text-sm text-muted-foreground">
                    {formData.rating}/5 étoiles
                  </span>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                placeholder="Décrivez votre feedback en détail..."
                rows={6}
                required
              />
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              <Send className="h-4 w-4 mr-2" />
              {isSubmitting ? "Envoi en cours..." : "Envoyer le feedback"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pourquoi votre feedback est important</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Nous aide à améliorer continuellement l&apos;application</li>
            <li>• Permet de prioriser les nouvelles fonctionnalités</li>
            <li>• Identifie les problèmes à corriger rapidement</li>
            <li>• Améliore l&apos;expérience utilisateur pour tous</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
