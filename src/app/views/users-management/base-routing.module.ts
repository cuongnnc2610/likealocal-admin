import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditComponent } from './edit/edit.component';
import { AddComponent } from './add/add.component';
import { DetailComponent} from './detail/detail.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: ''
    },
    children: [
      {
        path: '',
        redirectTo: 'add'
      },
      {
        path: 'edit',
        component: EditComponent,
        data: {
          title: 'Edit User'
        }
      },
      {
        path: 'add',
        component: AddComponent,
        data: {
          title: 'Add User'
        }
      },
      {
        path: 'detail',
        component: DetailComponent,
        data: {
          title: 'Detail User'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BaseRoutingModule {}
