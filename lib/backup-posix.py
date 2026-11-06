#!/usr/bin/env python3
"""Read-only capability gate. Shared-UID write.lock has no enforced isolation.

Archive creation is deliberately unavailable. No source or output filesystem
operations are performed by this provider. Historical b07 code is retained in
its frozen artifact, not as an environment-switchable fallback here.
"""
import json
import platform
import sys

CODE = 'BACKUP_LOCK_ISOLATION_UNVERIFIED'
MESSAGE = 'Shared-UID writable lock directories do not provide enforced lock isolation; automatic backup is disabled'


class Rejected(Exception):
    def __init__(self, code, message):
        self.code, self.message = code, message


def execute(q):
    if not isinstance(q, dict):
        raise Rejected('BACKUP_REQUEST_INVALID', 'Expected a JSON object')
    if set(q) - {'mode', 'source', 'out_parent', 'out_name', 'expected_entries', 'operation_id', 'expected_capability'}:
        raise Rejected('BACKUP_REQUEST_INVALID', 'Unknown provider fields')
    if q.get('mode') not in ('inspect', 'create'):
        raise Rejected('BACKUP_REQUEST_INVALID', 'Unknown provider mode')
    if q['mode'] == 'create':
        raise Rejected(CODE, MESSAGE)
    if sys.platform != 'linux' or platform.machine() != 'x86_64':
        raise Rejected('BACKUP_PLATFORM_UNSUPPORTED', 'No supported isolated backup provider on this platform')
    return {'ok': True, 'scope': 'capability-only',
            'lock_isolation': {'verified': False, 'code': CODE, 'message': MESSAGE,
                               'required': 'OS-enforced protected coordination domain; not an input flag'},
            'kernel_release': platform.release(), 'python_version': platform.python_version()}


if __name__ == '__main__':
    try:
        print(json.dumps(execute(json.loads(sys.stdin.buffer.read().decode('utf-8')))))
    except Rejected as error:
        print(json.dumps({'ok': False, 'code': error.code, 'error': error.message}))
        sys.exit(2)
    except (ValueError, TypeError) as error:
        print(json.dumps({'ok': False, 'code': 'BACKUP_REQUEST_INVALID', 'error': str(error)}))
        sys.exit(2)
