# LIM Digital Platform

Platform manajemen organisasi (LIM): sekretariat surat-menyurat, falak, program, CMS, dan konten publik — dibangun sebagai modul-modul fitur di atas Next.js App Router.

## Language

### Server actions

**Action**:
Entry point mutasi server-side yang di-export dari `modules/<fitur>/presentation/*.action.ts`, dijaga tepat satu permission slug.
_Avoid_: endpoint, API route, handler (untuk action utuh)

**Action shell**:
Scaffolding berulang di sekeliling setiap action — cek sesi/permission, parsing input, pemetaan error, revalidasi cache. Dimiliki satu modul (`defineAction`), bukan disalin per action.
_Avoid_: boilerplate action, wrapper

**Permission slug**:
Identifier izin berformat `domain.resource.action` (mis. `secretariat.outgoing.create`) yang dicek terhadap permission matrix per role.
_Avoid_: role check, guard string
