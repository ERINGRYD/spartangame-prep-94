import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, Calendar, HardDrive, Trash2 } from 'lucide-react';
import { useGameState } from '@/hooks/useGameState';

interface Material {
  id: string;
  name: string;
  size: number;
  uploadDate: string;
  type: string;
}

export const ScrollLibrary = () => {
  const { gainXP } = useGameState();
  const [materials, setMaterials] = useState<Material[]>(() => {
    const saved = localStorage.getItem('spartanMaterials');
    return saved ? JSON.parse(saved) : [];
  });
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const saveMaterials = (newMaterials: Material[]) => {
    setMaterials(newMaterials);
    localStorage.setItem('spartanMaterials', JSON.stringify(newMaterials));
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;

    const newMaterials: Material[] = [];
    
    Array.from(files).forEach(file => {
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        const newMaterial: Material = {
          id: Date.now() + Math.random().toString(),
          name: file.name,
          size: file.size,
          uploadDate: new Date().toISOString(),
          type: 'PDF'
        };
        newMaterials.push(newMaterial);
      }
    });

    if (newMaterials.length > 0) {
      const updatedMaterials = [...materials, ...newMaterials];
      saveMaterials(updatedMaterials);
      gainXP(10 * newMaterials.length);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(e.target.files);
  };

  const handleDeleteMaterial = (id: string) => {
    const updatedMaterials = materials.filter(material => material.id !== id);
    saveMaterials(updatedMaterials);
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-bronze opacity-10" />
        
        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-secondary" />
            Biblioteca de Pergaminhos
          </CardTitle>
        </CardHeader>

        <CardContent className="relative z-10">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
              dragOver 
                ? 'border-secondary bg-secondary/10' 
                : 'border-border hover:border-secondary/50'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">
              Adicione seus materiais de estudo
            </h3>
            <p className="text-muted-foreground mb-4">
              Arraste e solte arquivos PDF aqui ou clique para selecionar
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              +10 XP por material enviado
            </p>
            
            <Button 
              onClick={() => fileInputRef.current?.click()}
              className="bg-gradient-bronze hover:opacity-90"
            >
              Selecionar Arquivos
            </Button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              multiple
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>
        </CardContent>
      </Card>

      {/* Materials List */}
      {materials.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-secondary" />
              Seus Pergaminhos ({materials.length})
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-3">
              {materials.map((material) => (
                <div
                  key={material.id}
                  className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-secondary" />
                    <div>
                      <h4 className="font-medium">{material.name}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <HardDrive className="w-3 h-3" />
                          {formatFileSize(material.size)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(material.uploadDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteMaterial(material.id)}
                    className="hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};