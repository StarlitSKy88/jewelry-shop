import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Checkbox,
  Grid,
} from '@mui/material';
import { useState, useEffect } from 'react';

const defaultPermissions = {
  user: {
    view: false,
    create: false,
    edit: false,
    delete: false,
  },
  product: {
    view: false,
    create: false,
    edit: false,
    delete: false,
  },
  order: {
    view: false,
    create: false,
    edit: false,
    delete: false,
  },
  marketing: {
    view: false,
    create: false,
    edit: false,
    delete: false,
  },
};

function RoleDialog({ open, onClose, user, selectedUsers }) {
  const [permissions, setPermissions] = useState(defaultPermissions);

  useEffect(() => {
    if (user) {
      // 如果是编辑单个用户的权限，从用户数据中加载权限设置
      // 这里使用默认权限作为示例
      setPermissions(defaultPermissions);
    } else {
      // 批量编辑时使用默认权限
      setPermissions(defaultPermissions);
    }
  }, [user]);

  const handlePermissionChange = (module, permission) => (event) => {
    setPermissions(prev => ({
      ...prev,
      [module]: {
        ...prev[module],
        [permission]: event.target.checked,
      },
    }));
  };

  const handleSubmit = () => {
    // 提交权限修改
    console.log('Submit permissions:', {
      user: user?.id || 'batch',
      selectedUsers,
      permissions,
    });
    onClose();
  };

  const renderPermissionGroup = (module, label) => (
    <Grid item xs={12} sm={6}>
      <FormControl component="fieldset" variant="standard">
        <FormLabel component="legend">{label}</FormLabel>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={permissions[module].view}
                onChange={handlePermissionChange(module, 'view')}
              />
            }
            label="查看"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={permissions[module].create}
                onChange={handlePermissionChange(module, 'create')}
              />
            }
            label="创建"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={permissions[module].edit}
                onChange={handlePermissionChange(module, 'edit')}
              />
            }
            label="编辑"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={permissions[module].delete}
                onChange={handlePermissionChange(module, 'delete')}
              />
            }
            label="删除"
          />
        </FormGroup>
      </FormControl>
    </Grid>
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {user ? `修改用户"${user.name}"的权限` : '批量修改用户权限'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          {renderPermissionGroup('user', '用户管理')}
          {renderPermissionGroup('product', '商品管理')}
          {renderPermissionGroup('order', '订单管理')}
          {renderPermissionGroup('marketing', '营销管理')}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>取消</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          保存
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default RoleDialog; 