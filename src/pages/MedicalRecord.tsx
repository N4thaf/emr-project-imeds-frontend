import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { TopNav } from "@/components/navigation/top-nav";
import { Search, User, FileText, Activity, TestTube, Stethoscope, ClipboardList, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PatientData, PatientsData, PersonalInfo } from "..";
import { useSearchParams } from "react-router-dom";
import { usePatient } from "@/hooks/use-patient";

const MedicalRecord = () => {
  const [nik, setNik] = useState("");
  const [showRecord, setShowRecord] = useState(false);
  const { toast } = useToast();

  const [searchParams] = useSearchParams();
  const nikParams = searchParams.get("nik");
  const { data, loading, error, fetchPatient } = usePatient();
  
  const [patientData, setPatentData] = useState<PatientData | null>(null)

  useEffect(() => {
    if(nikParams && data === null) {
      fetchPatient(nikParams);
    } else {
      setPatentData(data);
      setShowRecord(true);

      toast({
        title: "Patient Found",
        description: `Medical record for NIK ${nikParams} loaded successfully`,
      });
    }
  }, [data, nikParams])


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (nik.length >= 10) {
      fetchPatient(nik);

      setPatentData(data);
      setShowRecord(true);
      toast({
        title: "Patient Found",
        description: `Medical record for NIK ${nik} loaded successfully`,
      });
    } else {
      toast({
        title: "Invalid NIK",
        description: "Please enter a valid NIK (minimum 10 digits)",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "high": return "text-red-600";
      case "low": return "text-blue-600";
      case "normal": return "text-green-600";
      default: return "text-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Search className="h-6 w-6 text-medical-red" />
              <div>
                <CardTitle>Search Patient by NIK</CardTitle>
                <CardDescription>
                  Enter the National ID Number (NIK) to access patient medical records
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="nik" className="sr-only">NIK</Label>
                <Input
                  id="nik"
                  type="text"
                  placeholder="Enter NIK (e.g., 3201234567890123)"
                  value={nik}
                  onChange={(e) => setNik(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button type="submit" variant="medical" size="default">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </form>
          </CardContent>
        </Card>

        {(showRecord && !loading) && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <User className="h-6 w-6 text-medical-red" />
                  <CardTitle>Patient Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Full Name</Label>
                    <p className="text-lg font-semibold">{patientData.personalInfo.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">NIK</Label>
                    <p className="text-lg font-semibold">{patientData.personalInfo.nik}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Birth Date</Label>
                    <p className="text-lg">{patientData.personalInfo.birthDate}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Gender</Label>
                    <p className="text-lg">{patientData.personalInfo.gender}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                    <p className="text-lg">{patientData.personalInfo.phone}</p>
                  </div>
                  <div className="md:col-span-2 lg:col-span-1">
                    <Label className="text-sm font-medium text-muted-foreground">Address</Label>
                    <p className="text-lg">{patientData.personalInfo.address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <FileText className="h-6 w-6 text-medical-red" />
                  <CardTitle>Diagnosis</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Diagnosis</TableHead>
                      <TableHead>ICD-10 Code</TableHead>
                      <TableHead>Doctor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patientData.diagnosis.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.date}</TableCell>
                        <TableCell className="font-medium">{item.diagnosis}</TableCell>
                        <TableCell>{item.icd10}</TableCell>
                        <TableCell>{item.doctor}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Activity className="h-6 w-6 text-medical-red" />
                  <CardTitle>Vital Signs</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date/Time</TableHead>
                      <TableHead>Blood Pressure</TableHead>
                      <TableHead>Heart Rate</TableHead>
                      <TableHead>Temperature</TableHead>
                      <TableHead>Weight</TableHead>
                      <TableHead>Height</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patientData.vitals.map((vital, index) => (
                      <TableRow key={index}>
                        <TableCell>{vital.date} {vital.time}</TableCell>
                        <TableCell className="font-medium">{vital.bp}</TableCell>
                        <TableCell>{vital.hr} bpm</TableCell>
                        <TableCell>{vital.temp}</TableCell>
                        <TableCell>{vital.weight}</TableCell>
                        <TableCell>{vital.height}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <TestTube className="h-6 w-6 text-medical-red" />
                  <CardTitle>Laboratory Results</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Test</TableHead>
                      <TableHead>Result</TableHead>
                      <TableHead>Reference Range</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patientData.labResults.map((lab, index) => (
                      <TableRow key={index}>
                        <TableCell>{lab.date}</TableCell>
                        <TableCell>{lab.test}</TableCell>
                        <TableCell className="font-medium">{lab.result}</TableCell>
                        <TableCell>{lab.reference}</TableCell>
                        <TableCell className={`font-medium ${getStatusColor(lab.status)}`}>
                          {lab.status}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Stethoscope className="h-6 w-6 text-medical-red" />
                  <CardTitle>Treatments & Medications</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Medication</TableHead>
                      <TableHead>Dosage</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Prescribed By</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patientData.treatments.map((treatment, index) => (
                      <TableRow key={index}>
                        <TableCell>{treatment.date}</TableCell>
                        <TableCell className="font-medium">{treatment.medication}</TableCell>
                        <TableCell>{treatment.dosage}</TableCell>
                        <TableCell>{treatment.duration}</TableCell>
                        <TableCell>{treatment.doctor}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <ClipboardList className="h-6 w-6 text-medical-red" />
                  <CardTitle>Consultation Notes</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {patientData.consultationNotes.map((note, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-medical-gray-light">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-semibold text-foreground">{note.doctor}</p>
                          <p className="text-sm text-muted-foreground">{note.specialty}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">{note.date}</p>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <Label className="text-sm font-medium">Chief Complaint:</Label>
                          <p className="text-sm">{note.chief_complaint}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Assessment:</Label>
                          <p className="text-sm">{note.assessment}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Plan:</Label>
                          <p className="text-sm">{note.plan}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-6 w-6 text-medical-red" />
                  <CardTitle>Disposition</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Instructions</TableHead>
                      <TableHead>Next Appointment</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patientData.disposition.map((disp, index) => (
                      <TableRow key={index}>
                        <TableCell>{disp.date}</TableCell>
                        <TableCell className="font-medium">{disp.status}</TableCell>
                        <TableCell>{disp.instructions}</TableCell>
                        <TableCell>{disp.next_appointment}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default MedicalRecord;
