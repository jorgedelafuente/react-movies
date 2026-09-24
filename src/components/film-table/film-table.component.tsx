import './film-table.styles.css';

import {
   type ColumnDef,
   flexRender,
   getCoreRowModel,
   getSortedRowModel,
   useReactTable,
} from '@tanstack/react-table';

import MediaLink from '@/components/atoms/link/media-link.component';
import SortableHeader from '@/components/atoms/sortable-header/sortable-header.component';
import type { FilmInfoType } from '@/types/films.schemas';

const languageNames = new Intl.DisplayNames(['en'], { type: 'language' });

const formatLanguage = (code: string | undefined) => {
   if (!code) {
      return '—';
   }
   try {
      return languageNames.of(code);
   } catch {
      return code.toUpperCase();
   }
};

const columns: ColumnDef<FilmInfoType>[] = [
   {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => (
         <MediaLink
            id={row.original.id}
            mediaType={row.original.media_type}
            className="film-table__title-link"
         >
            <span className="film-table__title">{row.original.title}</span>
         </MediaLink>
      ),
   },
   {
      accessorKey: 'release_date',
      header: 'Release date',
   },
   {
      accessorKey: 'original_language',
      header: 'Language',
      cell: ({ getValue }) => formatLanguage(getValue<string>()),
   },
   {
      accessorKey: 'vote_average',
      header: 'Rating',
      cell: ({ getValue }) => (getValue<number>() ?? 0).toFixed(1),
   },
   {
      accessorKey: 'popularity',
      header: 'Popularity',
      cell: ({ getValue }) => (getValue<number>() ?? 0).toFixed(0),
   },
];

const FilmTable = ({ list }: { list: FilmInfoType[] }) => {
   const table = useReactTable({
      data: list,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
   });

   return (
      <div className="film-table">
         <div className="film-table__scroll">
            <table className="film-table__table">
               <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                     <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                           <SortableHeader
                              key={header.id}
                              sorted={header.column.getIsSorted()}
                              onSort={() => header.column.toggleSorting()}
                              className="film-table__header"
                           >
                              {flexRender(
                                 header.column.columnDef.header,
                                 header.getContext()
                              )}
                           </SortableHeader>
                        ))}
                     </tr>
                  ))}
               </thead>
               <tbody>
                  {table.getRowModel().rows.map((row) => (
                     <tr key={row.id} className="film-table__row">
                        {row.getVisibleCells().map((cell) => (
                           <td key={cell.id} className="film-table__cell">
                              {flexRender(
                                 cell.column.columnDef.cell,
                                 cell.getContext()
                              )}
                           </td>
                        ))}
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
   );
};

export default FilmTable;
