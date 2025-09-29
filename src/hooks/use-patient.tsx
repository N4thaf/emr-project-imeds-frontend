import { useEffect, useState } from "react"
import type { PatientData } from "../index.d.ts"

export function usePatient(nik?: string, autoFetch: boolean = false) {
  const [data, setData] = useState<PatientData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function fetchPatient(targetNik?: string) {
    const id = targetNik || nik
    if (!id) {
      setError("No NIK provided")
      return
    }

    setLoading(true)
    setError(null)
    try {
      const res = await fetch(
        `https://emr-project-imeds-backend.vercel.app/api/pasien/${id}`
      )
      if (!res.ok) throw new Error("Failed to fetch patient")
      const json = await res.json()
      setData(json)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (autoFetch && nik) {
      fetchPatient()
    }
  }, [autoFetch, nik])

  return { data, loading, error, fetchPatient }
}
